export type OrganizationStatus = "active" | "archived" | "deleted";
export type OrganizationMemberStatus =
  "pending" | "active" | "suspended" | "revoked" | "ended" | "rejected";
export type MembershipActorType = "staff" | "player" | "guardian";
export type OrganizationScopeKind = "organization" | "team" | "session";
export type AdministrativePermission =
  "reviewAttendance" | "correctAttendance" | "manageMembership" | "manageAssignments";

export interface ApsiOrganization {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly status: OrganizationStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ApsiOrganizationMembership {
  readonly id: string;
  readonly organizationId: string;
  readonly authSubject: string;
  readonly actorType: MembershipActorType;
  readonly status: OrganizationMemberStatus;
  readonly validFrom: Date;
  readonly validUntil: Date | null;
  readonly lastVerifiedAt: Date | null;
}

export interface AuthorizationScope {
  readonly organizationId: string;
  readonly kind: OrganizationScopeKind;
  readonly id: string;
}

export interface ApsiCoachAssignment {
  readonly id: string;
  readonly organizationId: string;
  readonly authSubject: string;
  readonly teamId: string | null;
  readonly sessionId: string | null;
  readonly scopeKind: "team" | "session";
  readonly status: OrganizationMemberStatus;
  readonly validFrom: Date;
  readonly validUntil: Date | null;
  readonly lastVerifiedAt: Date | null;
}

export interface ApsiAdministrativeGrant {
  readonly id: string;
  readonly organizationId: string;
  readonly authSubject: string;
  readonly permission: AdministrativePermission;
  readonly status: OrganizationMemberStatus;
  readonly scopeKind: OrganizationScopeKind;
  readonly scopeId: string;
  readonly validFrom: Date;
  readonly validUntil: Date | null;
  readonly lastVerifiedAt: Date | null;
}

export interface ApsiPlayerProfile {
  readonly id: string;
  readonly organizationId: string | null;
  readonly authSubject: string | null;
  readonly playerCode: string;
  readonly status: OrganizationMemberStatus | "active";
}

export interface ApsiGuardianRelationship {
  readonly id: string;
  readonly organizationId: string | null;
  readonly guardianAuthSubject: string;
  readonly playerId: string;
  readonly status: OrganizationMemberStatus | "active";
  readonly verifiedAt: Date | null;
}

export function authorizationScopeMatchesOrganization(
  scope: AuthorizationScope,
  organizationId: string,
): boolean {
  return scope.organizationId === organizationId;
}

export function isActiveOrganizationMembership(
  membership: ApsiOrganizationMembership | null | undefined,
  organizationId: string,
  now: Date,
): boolean {
  if (membership == null) return false;
  if (membership.organizationId !== organizationId) return false;
  if (membership.actorType !== "staff") return false;
  if (membership.status !== "active") return false;
  return (
    isVerifiedAtOrBefore(membership.lastVerifiedAt, now) &&
    isCurrent(membership.validFrom, membership.validUntil, now)
  );
}

export function assignmentCoversScope(
  assignment: ApsiCoachAssignment | null | undefined,
  scope: AuthorizationScope,
  now: Date,
): boolean {
  if (assignment == null) return false;
  if (assignment.organizationId !== scope.organizationId) return false;
  if (assignment.status !== "active") return false;
  if (!isVerifiedAtOrBefore(assignment.lastVerifiedAt, now)) return false;
  if (!isCurrent(assignment.validFrom, assignment.validUntil, now)) return false;

  if (scope.kind === "team") {
    return assignment.scopeKind === "team" && assignment.teamId === scope.id;
  }

  if (scope.kind === "session") {
    return assignment.scopeKind === "session" && assignment.sessionId === scope.id;
  }

  return false;
}

export function isEligibleCoachAssignment(
  assignment: ApsiCoachAssignment | null | undefined,
  scope: AuthorizationScope,
  now: Date,
): boolean {
  return assignmentCoversScope(assignment, scope, now);
}

export function grantAllowsCapability(
  grant: ApsiAdministrativeGrant | null | undefined,
  permission: AdministrativePermission,
  organizationId: string,
  now: Date,
  scope?: AuthorizationScope,
): boolean {
  if (grant == null) return false;
  if (grant.organizationId !== organizationId) return false;
  if (scope != null && scope.organizationId !== organizationId) return false;
  if (scope?.kind === "organization" && scope.id !== organizationId) return false;
  if (grant.permission !== permission) return false;
  if (grant.status !== "active") return false;
  if (!isVerifiedAtOrBefore(grant.lastVerifiedAt, now)) return false;
  if (!isCurrent(grant.validFrom, grant.validUntil, now)) return false;

  if (grant.scopeKind === "organization") {
    return grant.scopeId === organizationId;
  }

  if (scope == null) {
    return false;
  }

  if (grant.scopeKind !== scope.kind) {
    return false;
  }

  return grant.scopeId === scope.id;
}

function isVerifiedAtOrBefore(verifiedAt: Date | null, now: Date): boolean {
  if (verifiedAt == null) return false;
  const verifiedAtTime = verifiedAt.getTime();
  const nowTime = now.getTime();
  return Number.isFinite(verifiedAtTime) && Number.isFinite(nowTime) && verifiedAtTime <= nowTime;
}

function isCurrent(validFrom: Date, validUntil: Date | null, now: Date): boolean {
  const nowTime = now.getTime();
  const startTime = validFrom.getTime();
  const endTime = validUntil?.getTime();

  return (
    Number.isFinite(nowTime) &&
    Number.isFinite(startTime) &&
    startTime <= nowTime &&
    (validUntil == null || (endTime != null && Number.isFinite(endTime) && endTime > nowTime))
  );
}
