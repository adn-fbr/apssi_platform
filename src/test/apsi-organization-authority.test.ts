import { describe, expect, it } from "vitest";

import {
  authorizationScopeMatchesOrganization,
  assignmentCoversScope,
  grantAllowsCapability,
  isActiveOrganizationMembership,
  isEligibleCoachAssignment,
  type ApsiAdministrativeGrant,
  type ApsiCoachAssignment,
  type ApsiOrganizationMembership,
  type AuthorizationScope,
} from "@/lib/apsi-organization-authority";

const organizationId = "apsi-org-001";
const otherOrganizationId = "apsi-org-999";
const teamId = "team-u9";
const sessionId = "session-2026-01-12";
const now = new Date("2026-01-10T12:00:00.000Z");

function activeMembership(actorType: "staff" | "player" | "guardian"): ApsiOrganizationMembership {
  return {
    id: "membership-1",
    organizationId,
    authSubject: "subject-123",
    actorType,
    status: "active",
    validFrom: new Date("2025-12-01T00:00:00.000Z"),
    validUntil: null,
    lastVerifiedAt: new Date("2026-01-08T00:00:00.000Z"),
  };
}

function activeAssignment(
  scope: AuthorizationScope & { kind: "team" | "session" },
  assignmentOrganizationId = scope.organizationId,
): ApsiCoachAssignment {
  return {
    id: "assignment-1",
    organizationId: assignmentOrganizationId,
    authSubject: "subject-123",
    teamId: scope.kind === "team" ? scope.id : null,
    sessionId: scope.kind === "session" ? scope.id : null,
    scopeKind: scope.kind,
    status: "active",
    validFrom: new Date("2025-12-01T00:00:00.000Z"),
    validUntil: null,
    lastVerifiedAt: new Date("2026-01-08T00:00:00.000Z"),
  };
}

function activeGrant(
  permission: ApsiAdministrativeGrant["permission"],
  grantOrganizationId = organizationId,
): ApsiAdministrativeGrant {
  return {
    id: "grant-1",
    organizationId: grantOrganizationId,
    authSubject: "subject-123",
    permission,
    status: "active",
    scopeKind: "organization",
    scopeId: grantOrganizationId,
    validFrom: new Date("2025-12-01T00:00:00.000Z"),
    validUntil: null,
    lastVerifiedAt: new Date("2026-01-08T00:00:00.000Z"),
  };
}

describe("APSI organization authority foundation", () => {
  it("accepts an active staff membership only within the matching organization", () => {
    expect(isActiveOrganizationMembership(activeMembership("staff"), organizationId, now)).toBe(
      true,
    );
    expect(
      isActiveOrganizationMembership(activeMembership("staff"), otherOrganizationId, now),
    ).toBe(false);
    expect(
      isActiveOrganizationMembership(
        { ...activeMembership("staff"), lastVerifiedAt: null },
        organizationId,
        now,
      ),
    ).toBe(false);
    expect(
      isActiveOrganizationMembership(
        { ...activeMembership("staff"), lastVerifiedAt: new Date("2026-01-11T00:00:00.000Z") },
        organizationId,
        now,
      ),
    ).toBe(false);
  });

  it("denies inactive, suspended, revoked, ended, and rejected membership states", () => {
    for (const status of ["pending", "suspended", "revoked", "ended", "rejected"] as const) {
      const membership: ApsiOrganizationMembership = {
        ...activeMembership("staff"),
        status,
      };
      expect(isActiveOrganizationMembership(membership, organizationId, now)).toBe(false);
    }
  });

  it("requires an exact team or session scope for an active coach assignment", () => {
    const scope: AuthorizationScope & { kind: "session" } = {
      kind: "session",
      id: sessionId,
      organizationId,
    };
    expect(assignmentCoversScope(activeAssignment(scope), scope, now)).toBe(true);
    expect(
      assignmentCoversScope(
        activeAssignment({ kind: "team", id: teamId, organizationId }),
        scope,
        now,
      ),
    ).toBe(false);
    expect(
      assignmentCoversScope(
        activeAssignment({ kind: "session", id: sessionId, organizationId: otherOrganizationId }),
        scope,
        now,
      ),
    ).toBe(false);
  });

  it("allows a current assignment only when it is active and in the exact organization", () => {
    const exactScope: AuthorizationScope & { kind: "team" } = {
      kind: "team",
      id: teamId,
      organizationId,
    };
    const assignment = activeAssignment({ kind: "team", id: teamId, organizationId });
    expect(isEligibleCoachAssignment(assignment, exactScope, now)).toBe(true);
    expect(
      isEligibleCoachAssignment(
        { ...assignment, organizationId: otherOrganizationId },
        exactScope,
        now,
      ),
    ).toBe(false);
  });

  it("keeps distinct administrative grants separate", () => {
    const scope: AuthorizationScope & { kind: "session" } = {
      kind: "session",
      id: sessionId,
      organizationId,
    };
    expect(
      grantAllowsCapability(
        activeGrant("reviewAttendance"),
        "reviewAttendance",
        organizationId,
        now,
        scope,
      ),
    ).toBe(true);
    expect(
      grantAllowsCapability(
        activeGrant("reviewAttendance"),
        "correctAttendance",
        organizationId,
        now,
        scope,
      ),
    ).toBe(false);
    expect(
      grantAllowsCapability(
        activeGrant("correctAttendance"),
        "manageMembership",
        organizationId,
        now,
        scope,
      ),
    ).toBe(false);
    expect(
      grantAllowsCapability(
        activeGrant("manageMembership"),
        "manageAssignments",
        organizationId,
        now,
        scope,
      ),
    ).toBe(false);
    expect(
      grantAllowsCapability(
        activeGrant("reviewAttendance", otherOrganizationId),
        "reviewAttendance",
        organizationId,
        now,
        scope,
      ),
    ).toBe(false);
    expect(
      grantAllowsCapability(
        { ...activeGrant("reviewAttendance"), scopeKind: "team", scopeId: teamId },
        "reviewAttendance",
        organizationId,
        now,
        scope,
      ),
    ).toBe(false);
    expect(
      grantAllowsCapability(
        activeGrant("reviewAttendance"),
        "reviewAttendance",
        organizationId,
        now,
        { ...scope, organizationId: otherOrganizationId },
      ),
    ).toBe(false);
    expect(
      grantAllowsCapability(
        { ...activeGrant("reviewAttendance"), scopeKind: "session", scopeId: "other-session" },
        "reviewAttendance",
        organizationId,
        now,
        scope,
      ),
    ).toBe(false);
  });

  it("requires verification timestamps for assignments and grants", () => {
    const scope: AuthorizationScope & { kind: "session" } = {
      kind: "session",
      id: sessionId,
      organizationId,
    };
    expect(
      assignmentCoversScope({ ...activeAssignment(scope), lastVerifiedAt: null }, scope, now),
    ).toBe(false);
    expect(
      grantAllowsCapability(
        { ...activeGrant("reviewAttendance"), lastVerifiedAt: null },
        "reviewAttendance",
        organizationId,
        now,
        scope,
      ),
    ).toBe(false);
  });

  it("does not infer player or guardian membership as staff membership", () => {
    expect(isActiveOrganizationMembership(activeMembership("player"), organizationId, now)).toBe(
      false,
    );
    expect(isActiveOrganizationMembership(activeMembership("guardian"), organizationId, now)).toBe(
      false,
    );
  });

  it("treats the organization as the authoritative scope source", () => {
    const scope: AuthorizationScope = { kind: "organization", id: organizationId, organizationId };
    expect(authorizationScopeMatchesOrganization(scope, organizationId)).toBe(true);
    expect(
      authorizationScopeMatchesOrganization(
        { ...scope, organizationId: otherOrganizationId },
        organizationId,
      ),
    ).toBe(false);
  });
});
