import {
  assignmentCoversScope,
  grantAllowsCapability,
  isActiveOrganizationMembership,
  type ApsiAdministrativeGrant,
  type ApsiCoachAssignment,
  type ApsiOrganizationMembership,
  type AuthorizationScope,
} from "./apsi-organization-authority";
import {
  requireAuthenticatedIdentity,
  supabaseAuthenticationProvider,
  type AuthenticationProvider,
  type AuthenticatedIdentity,
} from "./authentication.server";
import { createApsiAuthorizationDataSource } from "./apsi-authorization-data-source.server";

export type AttendanceOperation =
  | "viewSessions"
  | "viewRoster"
  | "createDraft"
  | "markAttendance"
  | "confirmQr"
  | "submitAttendance"
  | "reviewAttendance"
  | "correctAttendance"
  | "readAttendanceHistory"
  | "manageMembership"
  | "manageAssignments";

export interface ResourceReference {
  readonly kind: "organization" | "team" | "session";
  readonly id: string;
}

export interface ResolvedResourceScope {
  readonly organizationId: string;
  readonly teamId: string | null;
  readonly sessionId: string | null;
}

export type RelationshipStatus =
  "pending" | "active" | "suspended" | "revoked" | "ended" | "rejected";

export interface OrganizationMembership {
  readonly organizationId?: string;
  readonly authSubject?: string;
  readonly actorType: "staff" | "player" | "guardian";
  readonly status: RelationshipStatus;
  readonly validFrom?: Date;
  readonly validUntil?: Date | null;
  readonly lastVerifiedAt?: Date | null;
}

export interface CoachAssignment {
  readonly organizationId: string;
  readonly authSubject?: string;
  readonly status: RelationshipStatus;
  readonly scope: {
    readonly kind: "team" | "session";
    readonly id: string;
  };
  readonly validFrom: Date;
  readonly validUntil: Date | null;
  readonly lastVerifiedAt?: Date | null;
  readonly teamId?: string | null;
  readonly sessionId?: string | null;
  readonly scopeKind?: "team" | "session";
}

export type AdministrativePermission =
  "reviewAttendance" | "correctAttendance" | "manageMembership" | "manageAssignments";

export interface PermissionGrant {
  readonly permission: AdministrativePermission;
  readonly organizationId: string;
  readonly status: RelationshipStatus;
  readonly scope: {
    readonly kind: "organization" | "team" | "session";
    readonly id: string;
  };
  readonly validFrom: Date;
  readonly validUntil: Date | null;
  readonly lastVerifiedAt?: Date | null;
  readonly scopeKind?: "organization" | "team" | "session";
  readonly scopeId?: string;
}

export interface AuthorizationDataSource {
  resolveResource(reference: ResourceReference): Promise<ResolvedResourceScope | null>;
  findMembership(subject: string, organizationId: string): Promise<OrganizationMembership | null>;
  findCoachAssignment(
    subject: string,
    scope: ResolvedResourceScope,
  ): Promise<CoachAssignment | null>;
  findPermissionGrant(
    subject: string,
    permission: AdministrativePermission,
    scope: ResolvedResourceScope,
  ): Promise<PermissionGrant | null>;
}

export interface AuthorizationDependencies {
  readonly authenticationProvider?: AuthenticationProvider;
  readonly dataSource?: AuthorizationDataSource;
  readonly now?: () => Date;
}

export interface AuthorizedAttendanceContext {
  readonly identity: AuthenticatedIdentity;
  readonly scope: ResolvedResourceScope;
  readonly operation: AttendanceOperation;
}

export class ForbiddenError extends Error {
  readonly statusCode = 403;
  readonly code = "forbidden";

  constructor() {
    super("Forbidden.");
    this.name = "ForbiddenError";
  }
}

export class AuthorizationUnavailableError extends Error {
  readonly statusCode = 503;
  readonly code = "authorization_unavailable";

  constructor() {
    super("Authorization data source is not configured.");
    this.name = "AuthorizationUnavailableError";
  }
}

const coachWriteOperations = new Set<AttendanceOperation>([
  "createDraft",
  "markAttendance",
  "confirmQr",
  "submitAttendance",
]);

const scopedReadOperations = new Set<AttendanceOperation>(["viewSessions", "viewRoster"]);

const permissionForOperation: Partial<Record<AttendanceOperation, AdministrativePermission>> = {
  viewSessions: "reviewAttendance",
  viewRoster: "reviewAttendance",
  reviewAttendance: "reviewAttendance",
  correctAttendance: "correctAttendance",
  manageMembership: "manageMembership",
  manageAssignments: "manageAssignments",
};

export async function authorizeAttendanceOperation(
  request: Request,
  operation: AttendanceOperation,
  resource: ResourceReference,
  dependencies: AuthorizationDependencies = {},
): Promise<AuthorizedAttendanceContext> {
  const identity = await requireAuthenticatedIdentity(
    request,
    dependencies.authenticationProvider ?? supabaseAuthenticationProvider,
  );
  let dataSource = dependencies.dataSource;
  if (dataSource === undefined) {
    try {
      dataSource = createApsiAuthorizationDataSource();
    } catch {
      throw new AuthorizationUnavailableError();
    }
  }
  const now = dependencies.now?.() ?? new Date();

  const scope = await fromDataSource(() => dataSource.resolveResource(resource));
  if (
    scope == null ||
    typeof scope.organizationId !== "string" ||
    scope.organizationId.trim().length === 0
  ) {
    throw new ForbiddenError();
  }

  const membership = await fromDataSource(() =>
    dataSource.findMembership(identity.subject, scope.organizationId),
  );

  if (
    !isActiveOrganizationMembership(
      toMembershipRecord(membership, identity.subject, scope),
      scope.organizationId,
      now,
    )
  ) {
    throw new ForbiddenError();
  }

  if (coachWriteOperations.has(operation)) {
    const assignment = await fromDataSource(() =>
      dataSource.findCoachAssignment(identity.subject, scope),
    );
    const requestedScope = toAuthorizedScope(scope);
    const assignmentRecord = toAssignmentRecord(assignment, identity.subject);
    if (
      !assignmentCoversScope(assignmentRecord, requestedScope, now) &&
      !assignmentCoversResolvedScope(assignmentRecord, scope, now)
    ) {
      throw new ForbiddenError();
    }

    return Object.freeze({ identity, scope, operation });
  }

  if (scopedReadOperations.has(operation)) {
    const assignment = await fromDataSource(() =>
      dataSource.findCoachAssignment(identity.subject, scope),
    );
    const requestedScope = toAuthorizedScope(scope);
    const assignmentRecord = toAssignmentRecord(assignment, identity.subject);
    if (
      assignmentCoversScope(assignmentRecord, requestedScope, now) ||
      assignmentCoversResolvedScope(assignmentRecord, scope, now)
    ) {
      return Object.freeze({ identity, scope, operation });
    }

    const grant = await fromDataSource(() =>
      dataSource.findPermissionGrant(identity.subject, "reviewAttendance", scope),
    );
    if (
      grantAllowsCapability(
        toGrantRecord(grant),
        "reviewAttendance",
        scope.organizationId,
        now,
        requestedScope,
      )
    ) {
      return Object.freeze({ identity, scope, operation });
    }

    throw new ForbiddenError();
  }

  const permission = permissionForOperation[operation];
  if (permission == null) {
    throw new ForbiddenError();
  }

  const grant = await fromDataSource(() =>
    dataSource.findPermissionGrant(identity.subject, permission, scope),
  );
  const requestedScope = toAuthorizedScope(scope);
  if (
    !grantAllowsCapability(
      toGrantRecord(grant),
      permission,
      scope.organizationId,
      now,
      requestedScope,
    )
  ) {
    throw new ForbiddenError();
  }

  return Object.freeze({ identity, scope, operation });
}

async function fromDataSource<T>(read: () => Promise<T>): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (error instanceof AuthorizationUnavailableError) {
      throw error;
    }

    throw new AuthorizationUnavailableError();
  }
}

function toMembershipRecord(
  membership: OrganizationMembership | null | undefined,
  subject: string,
  scope: ResolvedResourceScope,
): ApsiOrganizationMembership | null {
  if (membership == null) return null;

  return {
    id: membership.authSubject ?? subject,
    organizationId: membership.organizationId ?? scope.organizationId,
    authSubject: membership.authSubject ?? subject,
    actorType: membership.actorType,
    status: membership.status,
    validFrom: membership.validFrom ?? new Date(0),
    validUntil: membership.validUntil ?? null,
    lastVerifiedAt:
      membership.lastVerifiedAt === undefined ? new Date(0) : membership.lastVerifiedAt,
  };
}

function toAssignmentRecord(
  assignment: CoachAssignment | null | undefined,
  subject: string,
): ApsiCoachAssignment | null {
  if (assignment == null) return null;

  const assignmentScope = assignment.scopeKind ?? assignment.scope.kind;
  const assignmentId =
    assignmentScope === "team"
      ? (assignment.teamId ?? assignment.scope.id)
      : (assignment.sessionId ?? assignment.scope.id);

  return {
    id: assignment.authSubject ?? subject,
    organizationId: assignment.organizationId,
    authSubject: assignment.authSubject ?? subject,
    teamId: assignmentScope === "team" ? assignmentId : null,
    sessionId: assignmentScope === "session" ? assignmentId : null,
    scopeKind: assignmentScope,
    status: assignment.status,
    validFrom: assignment.validFrom ?? new Date(0),
    validUntil: assignment.validUntil,
    lastVerifiedAt:
      assignment.lastVerifiedAt === undefined ? new Date(0) : assignment.lastVerifiedAt,
  };
}

function toGrantRecord(grant: PermissionGrant | null | undefined): ApsiAdministrativeGrant | null {
  if (grant == null) return null;

  const scopeKind = grant.scopeKind ?? grant.scope.kind;
  const scopeId = grant.scopeId ?? grant.scope.id;

  return {
    id: `${grant.permission}-${scopeKind}-${scopeId}`,
    organizationId: grant.organizationId,
    authSubject: "subject",
    permission: grant.permission,
    status: grant.status,
    scopeKind,
    scopeId,
    validFrom: grant.validFrom ?? new Date(0),
    validUntil: grant.validUntil,
    lastVerifiedAt: grant.lastVerifiedAt === undefined ? new Date(0) : grant.lastVerifiedAt,
  };
}

function toAuthorizedScope(scope: ResolvedResourceScope): AuthorizationScope {
  if (scope.sessionId != null) {
    return { organizationId: scope.organizationId, kind: "session", id: scope.sessionId };
  }

  if (scope.teamId != null) {
    return { organizationId: scope.organizationId, kind: "team", id: scope.teamId };
  }

  return { organizationId: scope.organizationId, kind: "organization", id: scope.organizationId };
}

function assignmentCoversResolvedScope(
  assignment: ApsiCoachAssignment | null,
  scope: ResolvedResourceScope,
  now: Date,
): boolean {
  if (assignment == null) return false;
  if (assignment.organizationId !== scope.organizationId) return false;
  if (assignment.status !== "active") return false;
  if (assignment.lastVerifiedAt == null || assignment.lastVerifiedAt.getTime() > now.getTime()) {
    return false;
  }
  if (assignment.validUntil != null && assignment.validUntil.getTime() <= now.getTime()) {
    return false;
  }
  if (assignment.validFrom.getTime() > now.getTime()) {
    return false;
  }

  if (scope.sessionId != null && assignment.scopeKind === "team") {
    return assignment.teamId != null && assignment.teamId === scope.teamId;
  }

  if (scope.teamId != null && assignment.scopeKind === "session") {
    return assignment.sessionId != null && assignment.sessionId === scope.sessionId;
  }

  return false;
}
