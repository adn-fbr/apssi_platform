import type { SupabaseClient } from "@supabase/supabase-js";

import { createRequestScopedSupabaseClient } from "./supabase.server";
import type {
  AdministrativePermission,
  AuthorizationDataSource,
  CoachAssignment,
  OrganizationMembership,
  PermissionGrant,
  RelationshipStatus,
  ResolvedResourceScope,
} from "./authorization.server";

type DatabaseRow = Record<string, unknown>;
type QueryResult = { readonly data: unknown; readonly error: unknown };
type SupabaseClientFactory = () => SupabaseClient;

const relationshipStatuses = new Set<RelationshipStatus>([
  "pending",
  "active",
  "suspended",
  "revoked",
  "ended",
  "rejected",
]);

export function createApsiAuthorizationDataSource(
  clientFactory: SupabaseClientFactory = createRequestScopedSupabaseClient,
): AuthorizationDataSource {
  const client = clientFactory();

  return {
    async resolveResource(reference) {
      const table =
        reference.kind === "organization"
          ? "apsi_organizations"
          : reference.kind === "team"
            ? "apsi_teams"
            : "apsi_training_sessions";
      const columns =
        reference.kind === "organization"
          ? "id"
          : reference.kind === "team"
            ? "id,organization_id"
            : "id,organization_id,team_id";
      const rows = await selectRows(
        client.from(table).select(columns).eq("id", reference.id).limit(2),
      );
      if (rows.length !== 1) return null;

      const row = rows.at(0);
      if (row === undefined) return null;
      if (reference.kind === "organization") {
        return hasId(row, reference.id)
          ? { organizationId: reference.id, teamId: null, sessionId: null }
          : null;
      }

      const organizationId = stringValue(row, "organization_id");
      if (!hasId(row, reference.id) || organizationId === null) return null;

      if (reference.kind === "team") {
        return { organizationId, teamId: reference.id, sessionId: null };
      }

      const teamId = nullableStringValue(row, "team_id");
      if (teamId === undefined) return null;
      return { organizationId, teamId, sessionId: reference.id };
    },

    async findMembership(subject, organizationId) {
      const rows = await selectRows(
        client
          .from("apsi_organization_memberships")
          .select(
            "organization_id,auth_subject,actor_type,status,valid_from,valid_until,last_verified_at",
          )
          .eq("organization_id", organizationId)
          .eq("auth_subject", subject)
          .eq("actor_type", "staff")
          .eq("status", "active")
          .limit(2),
      );
      if (rows.length !== 1) return null;

      const row = rows.at(0);
      if (row === undefined) return null;
      const actorType = stringValue(row, "actor_type");
      const status = statusValue(row);
      const validFrom = dateValue(row, "valid_from");
      const validUntil = nullableDateValue(row, "valid_until");
      const lastVerifiedAt = nullableDateValue(row, "last_verified_at");
      if (
        stringValue(row, "organization_id") !== organizationId ||
        stringValue(row, "auth_subject") !== subject ||
        (actorType !== "staff" && actorType !== "player" && actorType !== "guardian") ||
        status === null ||
        validFrom === null ||
        validUntil === undefined ||
        lastVerifiedAt === undefined
      ) {
        return null;
      }

      return {
        organizationId,
        authSubject: subject,
        actorType,
        status,
        validFrom,
        validUntil,
        lastVerifiedAt,
      } satisfies OrganizationMembership;
    },

    async findCoachAssignment(subject, scope) {
      const sessionAssignment =
        scope.sessionId === null
          ? null
          : await findSingleAssignment(client, subject, scope, "session", scope.sessionId);
      if (sessionAssignment === "ambiguous") return null;
      if (sessionAssignment !== null) return sessionAssignment;

      if (scope.teamId === null) return null;
      const teamAssignment = await findSingleAssignment(
        client,
        subject,
        scope,
        "team",
        scope.teamId,
      );
      return teamAssignment === "ambiguous" ? null : teamAssignment;
    },

    async findPermissionGrant(subject, permission, scope) {
      const targetKind =
        scope.sessionId !== null ? "session" : scope.teamId !== null ? "team" : null;
      const targetId = scope.sessionId ?? scope.teamId;
      const applicableKinds = targetKind === null ? ["organization"] : ["organization", targetKind];
      const rows = await selectRows(
        client
          .from("apsi_administrative_grants")
          .select(
            "organization_id,auth_subject,permission,status,scope_kind,team_id,session_id,valid_from,valid_until,last_verified_at",
          )
          .eq("organization_id", scope.organizationId)
          .eq("auth_subject", subject)
          .eq("permission", permission)
          .eq("status", "active")
          .in("scope_kind", applicableKinds)
          .limit(4),
      );

      const grants = rows
        .map((row) => parseGrant(row, subject, permission, scope.organizationId))
        .filter((grant): grant is PermissionGrant => grant !== null);
      if (grants.length !== rows.length) return null;
      const exactGrants =
        targetKind === null
          ? []
          : grants.filter(
              (grant) => grant.scope.kind === targetKind && grant.scope.id === targetId,
            );
      if (exactGrants.length > 1) return null;
      const exactGrant = exactGrants.at(0);
      if (exactGrant !== undefined) return exactGrant;

      const organizationGrants = grants.filter(
        (grant) => grant.scope.kind === "organization" && grant.scope.id === scope.organizationId,
      );
      return organizationGrants.length === 1 ? (organizationGrants.at(0) ?? null) : null;
    },
  };
}

async function findSingleAssignment(
  client: SupabaseClient,
  subject: string,
  scope: ResolvedResourceScope,
  scopeKind: "team" | "session",
  scopeId: string,
): Promise<CoachAssignment | null | "ambiguous"> {
  const scopeColumn = scopeKind === "team" ? "team_id" : "session_id";
  const rows = await selectRows(
    client
      .from("apsi_coach_assignments")
      .select(
        "organization_id,auth_subject,team_id,session_id,scope_kind,status,valid_from,valid_until,last_verified_at",
      )
      .eq("organization_id", scope.organizationId)
      .eq("auth_subject", subject)
      .eq("scope_kind", scopeKind)
      .eq(scopeColumn, scopeId)
      .eq("status", "active")
      .limit(2),
  );
  if (rows.length > 1) return "ambiguous";
  if (rows.length === 0) return null;

  const row = rows.at(0);
  if (row === undefined) return null;
  const validFrom = dateValue(row, "valid_from");
  const validUntil = nullableDateValue(row, "valid_until");
  const lastVerifiedAt = nullableDateValue(row, "last_verified_at");
  const status = statusValue(row);
  if (
    stringValue(row, "organization_id") !== scope.organizationId ||
    stringValue(row, "auth_subject") !== subject ||
    stringValue(row, "scope_kind") !== scopeKind ||
    stringValue(row, scopeColumn) !== scopeId ||
    status === null ||
    validFrom === null ||
    validUntil === undefined ||
    lastVerifiedAt === undefined
  ) {
    return null;
  }

  return {
    organizationId: scope.organizationId,
    authSubject: subject,
    status,
    scope: { kind: scopeKind, id: scopeId },
    validFrom,
    validUntil,
    lastVerifiedAt,
    teamId: scopeKind === "team" ? scopeId : null,
    sessionId: scopeKind === "session" ? scopeId : null,
    scopeKind,
  };
}

function parseGrant(
  row: DatabaseRow,
  subject: string,
  permission: AdministrativePermission,
  organizationId: string,
): PermissionGrant | null {
  const status = statusValue(row);
  const validFrom = dateValue(row, "valid_from");
  const validUntil = nullableDateValue(row, "valid_until");
  const lastVerifiedAt = nullableDateValue(row, "last_verified_at");
  const scopeKind = stringValue(row, "scope_kind");
  const teamId = nullableStringValue(row, "team_id");
  const sessionId = nullableStringValue(row, "session_id");
  if (
    stringValue(row, "organization_id") !== organizationId ||
    stringValue(row, "auth_subject") !== subject ||
    stringValue(row, "permission") !== permission ||
    status === null ||
    validFrom === null ||
    validUntil === undefined ||
    lastVerifiedAt === undefined ||
    teamId === undefined ||
    sessionId === undefined
  ) {
    return null;
  }

  let grantScope: PermissionGrant["scope"];
  if (scopeKind === "organization" && teamId === null && sessionId === null) {
    grantScope = { kind: "organization", id: organizationId };
  } else if (scopeKind === "team" && teamId !== null && sessionId === null) {
    grantScope = { kind: "team", id: teamId };
  } else if (scopeKind === "session" && sessionId !== null && teamId === null) {
    grantScope = { kind: "session", id: sessionId };
  } else {
    return null;
  }

  return {
    permission,
    organizationId,
    status,
    scope: grantScope,
    validFrom,
    validUntil,
    lastVerifiedAt,
    scopeKind,
    scopeId: grantScope.id,
  };
}

async function selectRows(query: unknown): Promise<DatabaseRow[]> {
  const result = (await query) as QueryResult;
  if (result.error !== null && result.error !== undefined) throw result.error;
  if (!Array.isArray(result.data) || !result.data.every(isDatabaseRow)) {
    throw new Error("Authorization query returned an invalid result.");
  }
  return result.data;
}

function isDatabaseRow(value: unknown): value is DatabaseRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasId(row: DatabaseRow, id: string): boolean {
  return stringValue(row, "id") === id;
}

function stringValue(row: DatabaseRow, key: string): string | null {
  const value = row[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function nullableStringValue(row: DatabaseRow, key: string): string | null | undefined {
  const value = row[key];
  if (value === null) return null;
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function statusValue(row: DatabaseRow): RelationshipStatus | null {
  const status = stringValue(row, "status");
  return status !== null && relationshipStatuses.has(status as RelationshipStatus)
    ? (status as RelationshipStatus)
    : null;
}

function dateValue(row: DatabaseRow, key: string): Date | null {
  const value = row[key];
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function nullableDateValue(row: DatabaseRow, key: string): Date | null | undefined {
  if (row[key] === null) return null;
  return dateValue(row, key) ?? undefined;
}
