import { describe, expect, it } from "vitest";

import {
  AuthenticationUnavailableError,
  type AuthenticationProvider,
} from "@/lib/authentication.server";
import {
  AuthorizationUnavailableError,
  ForbiddenError,
  authorizeAttendanceOperation,
  type AdministrativePermission,
  type AuthorizationDataSource,
  type AuthorizationDependencies,
  type CoachAssignment,
  type OrganizationMembership,
  type PermissionGrant,
  type ResolvedResourceScope,
  type ResourceReference,
} from "@/lib/authorization.server";

const now = new Date("2026-11-17T12:00:00.000Z");
const sessionReference: ResourceReference = { kind: "session", id: "test-session" };
const canonicalScope: ResolvedResourceScope = {
  organizationId: "test-organization",
  teamId: "test-team",
  sessionId: "test-session",
};

const activeStaffMembership: OrganizationMembership = {
  status: "active",
  actorType: "staff",
};

function activeAssignment(
  scope: CoachAssignment["scope"] = { kind: "session", id: "test-session" },
): CoachAssignment {
  return {
    organizationId: "test-organization",
    status: "active",
    scope,
    validFrom: new Date("2026-01-01T00:00:00.000Z"),
    validUntil: null,
  };
}

function activeGrant(permission: AdministrativePermission): PermissionGrant {
  return {
    permission,
    organizationId: "test-organization",
    status: "active",
    scope: { kind: "organization", id: "test-organization" },
    validFrom: new Date("2026-01-01T00:00:00.000Z"),
    validUntil: null,
  };
}

function createTestBoundary(
  overrides: {
    readonly authenticate?: AuthenticationProvider["authenticate"];
    readonly scope?: ResolvedResourceScope | null;
    readonly membership?: OrganizationMembership | null;
    readonly assignment?: CoachAssignment | null;
    readonly grant?: PermissionGrant | null;
  } = {},
) {
  const membershipLookups: string[] = [];
  const permissionLookups: AdministrativePermission[] = [];
  const provider: AuthenticationProvider = {
    authenticate:
      overrides.authenticate ?? (async () => ({ subject: "controlled-test-principal" })),
  };
  const dataSource: AuthorizationDataSource = {
    async resolveResource() {
      return overrides.scope === undefined ? canonicalScope : overrides.scope;
    },
    async findMembership(_subject, organizationId) {
      membershipLookups.push(organizationId);
      return overrides.membership === undefined ? activeStaffMembership : overrides.membership;
    },
    async findCoachAssignment() {
      return overrides.assignment === undefined ? activeAssignment() : overrides.assignment;
    },
    async findPermissionGrant(_subject, permission) {
      permissionLookups.push(permission);
      return overrides.grant === undefined ? null : overrides.grant;
    },
  };

  const dependencies: AuthorizationDependencies = {
    authenticationProvider: provider,
    dataSource,
    now: () => now,
  };

  return { dependencies, membershipLookups, permissionLookups };
}

function request(headers?: HeadersInit): Request {
  return new Request(
    "https://unit.test/attendance",
    headers === undefined ? undefined : { headers },
  );
}

describe("server attendance authorization boundary", () => {
  it("fails closed when the authentication provider is unavailable", async () => {
    const boundary = createTestBoundary({
      authenticate: async () => {
        throw new AuthenticationUnavailableError();
      },
    });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "viewRoster",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toMatchObject({ statusCode: 503, code: "authentication_unavailable" });
  });

  it("denies a missing or invalid session", async () => {
    const boundary = createTestBoundary({ authenticate: async () => null });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "viewRoster",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toMatchObject({ statusCode: 401, code: "unauthenticated" });
  });

  it("denies an authenticated identity with an empty subject", async () => {
    const boundary = createTestBoundary({ authenticate: async () => ({ subject: " " }) });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "viewRoster",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toMatchObject({ statusCode: 401, code: "unauthenticated" });
  });

  it("does not let a browser-supplied role grant access", async () => {
    const boundary = createTestBoundary({ membership: null });

    await expect(
      authorizeAttendanceOperation(
        request({ "x-role": "coach" }),
        "markAttendance",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("uses server-resolved organization scope instead of a browser organization ID", async () => {
    const boundary = createTestBoundary();
    const context = await authorizeAttendanceOperation(
      request({ "x-organization-id": "attacker-organization" }),
      "viewRoster",
      { kind: "organization", id: "attacker-organization" },
      boundary.dependencies,
    );

    expect(context.scope.organizationId).toBe("test-organization");
    expect(boundary.membershipLookups).toEqual(["test-organization"]);
  });

  it.each(["pending", "suspended", "revoked", "ended", "rejected"] as const)(
    "denies a %s organization membership",
    async (status) => {
      const boundary = createTestBoundary({
        membership: { status, actorType: "staff" },
      });

      await expect(
        authorizeAttendanceOperation(
          request(),
          "markAttendance",
          sessionReference,
          boundary.dependencies,
        ),
      ).rejects.toBeInstanceOf(ForbiddenError);
    },
  );

  it("denies active membership without an explicit coach assignment", async () => {
    const boundary = createTestBoundary({ assignment: null });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "markAttendance",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it.each([
    { kind: "team", id: "another-team" },
    { kind: "session", id: "another-session" },
  ] as const)("denies a coach assignment for another $kind", async (scope) => {
    const boundary = createTestBoundary({ assignment: activeAssignment(scope) });

    await expect(
      authorizeAttendanceOperation(request(), "confirmQr", sessionReference, boundary.dependencies),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("denies an expired coach assignment", async () => {
    const expired = activeAssignment();
    const boundary = createTestBoundary({
      assignment: { ...expired, validUntil: new Date("2026-11-17T11:59:59.000Z") },
    });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "submitAttendance",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("fails closed when verification timestamps are missing or stale", async () => {
    const membershipBoundary = createTestBoundary({
      membership: { ...activeStaffMembership, lastVerifiedAt: null },
      assignment: { ...activeAssignment(), lastVerifiedAt: null },
    });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "markAttendance",
        sessionReference,
        membershipBoundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);

    const grantBoundary = createTestBoundary({
      assignment: null,
      grant: { ...activeGrant("reviewAttendance"), lastVerifiedAt: null },
    });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "viewRoster",
        sessionReference,
        grantBoundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("denies a resource in another organization without verified membership", async () => {
    const boundary = createTestBoundary({
      scope: { ...canonicalScope, organizationId: "another-organization" },
      membership: null,
    });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "viewRoster",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it.each(["manageMembership", "manageAssignments"] as const)(
    "does not infer %s from staff or administrator labels",
    async (operation) => {
      const boundary = createTestBoundary();

      await expect(
        authorizeAttendanceOperation(
          request({ "x-role": "ssb-administrator" }),
          operation,
          { kind: "organization", id: "test-organization" },
          boundary.dependencies,
        ),
      ).rejects.toBeInstanceOf(ForbiddenError);
    },
  );

  it.each(["player", "guardian"] as const)(
    "denies attendance administration to a %s identity",
    async (actorType) => {
      const boundary = createTestBoundary({
        membership: { status: "active", actorType },
      });

      await expect(
        authorizeAttendanceOperation(
          request(),
          "reviewAttendance",
          sessionReference,
          boundary.dependencies,
        ),
      ).rejects.toBeInstanceOf(ForbiddenError);
    },
  );

  it("does not grant a platform operator implicit player-data access", async () => {
    const boundary = createTestBoundary({ membership: null });

    await expect(
      authorizeAttendanceOperation(
        request({ "x-role": "platform-operator" }),
        "viewRoster",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("fails closed when the authoritative organization data source is unavailable", async () => {
    const boundary = createTestBoundary();

    await expect(
      authorizeAttendanceOperation(request(), "viewRoster", sessionReference, {
        authenticationProvider: {
          async authenticate() {
            return { subject: "controlled-test-principal" };
          },
        },
        dataSource: {
          async resolveResource() {
            throw new AuthorizationUnavailableError();
          },
          async findMembership() {
            throw new AuthorizationUnavailableError();
          },
          async findCoachAssignment() {
            throw new AuthorizationUnavailableError();
          },
          async findPermissionGrant() {
            throw new AuthorizationUnavailableError();
          },
        },
      }),
    ).rejects.toBeInstanceOf(AuthorizationUnavailableError);
  });

  it("allows a coach only within active membership and a current exact assignment", async () => {
    const boundary = createTestBoundary({
      assignment: activeAssignment({ kind: "team", id: "test-team" }),
    });
    const context = await authorizeAttendanceOperation(
      request(),
      "markAttendance",
      sessionReference,
      boundary.dependencies,
    );

    expect(context.operation).toBe("markAttendance");
    expect(context.identity.subject).toBe("controlled-test-principal");
  });

  it("requires a separate permission grant for each administrator operation", async () => {
    const boundary = createTestBoundary({ grant: activeGrant("reviewAttendance") });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "reviewAttendance",
        sessionReference,
        boundary.dependencies,
      ),
    ).resolves.toMatchObject({ operation: "reviewAttendance" });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "correctAttendance",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(boundary.permissionLookups).toEqual(["reviewAttendance", "correctAttendance"]);
  });

  it("allows an administrator to view a roster only with a separate scoped review grant", async () => {
    const boundary = createTestBoundary({
      assignment: null,
      grant: activeGrant("reviewAttendance"),
    });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "viewRoster",
        sessionReference,
        boundary.dependencies,
      ),
    ).resolves.toMatchObject({ operation: "viewRoster" });
    expect(boundary.permissionLookups).toEqual(["reviewAttendance"]);
  });

  it("denies revision-history access until its separate read scope is approved", async () => {
    const boundary = createTestBoundary({ grant: activeGrant("reviewAttendance") });

    await expect(
      authorizeAttendanceOperation(
        request(),
        "readAttendanceHistory",
        sessionReference,
        boundary.dependencies,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(boundary.permissionLookups).toEqual([]);
  });
});
