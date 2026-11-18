import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import type { AuthenticationProvider } from "@/lib/authentication.server";
import {
  AuthorizationUnavailableError,
  ForbiddenError,
  authorizeAttendanceOperation,
  type ResolvedResourceScope,
} from "@/lib/authorization.server";
import { createApsiAuthorizationDataSource } from "@/lib/apsi-authorization-data-source.server";

interface QueryResponse {
  readonly data: unknown;
  readonly error: unknown;
}

interface QueryCall {
  readonly table: string;
  columns?: string;
  readonly filters: Array<{
    readonly kind: "eq" | "in";
    readonly column: string;
    readonly value: unknown;
  }>;
  limit?: number;
}

function createSupabaseTestClient(responses: readonly QueryResponse[]) {
  const calls: QueryCall[] = [];
  let responseIndex = 0;
  const client = {
    from(table: string) {
      const call: QueryCall = { table, filters: [] };
      calls.push(call);
      const response = responses[responseIndex++] ?? { data: [], error: null };
      const builder = {
        select(columns: string) {
          call.columns = columns;
          return builder;
        },
        eq(column: string, value: unknown) {
          call.filters.push({ kind: "eq", column, value });
          return builder;
        },
        in(column: string, value: readonly string[]) {
          call.filters.push({ kind: "in", column, value });
          return builder;
        },
        limit(count: number) {
          call.limit = count;
          return builder;
        },
        then<TResult1 = QueryResponse, TResult2 = never>(
          onfulfilled?: ((value: QueryResponse) => TResult1 | PromiseLike<TResult1>) | null,
          onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
        ): PromiseLike<TResult1 | TResult2> {
          return Promise.resolve(response).then(onfulfilled, onrejected);
        },
      };
      return builder;
    },
  };

  return { client: client as unknown as SupabaseClient, calls };
}

function queryResponse(...data: readonly unknown[]): QueryResponse {
  return { data, error: null };
}

function sessionRow(organizationId = "org-a", teamId: string | null = "team-a"): unknown {
  return { id: "session-a", organization_id: organizationId, team_id: teamId };
}

function membershipRow(organizationId = "org-a"): unknown {
  return {
    organization_id: organizationId,
    auth_subject: "subject-a",
    actor_type: "staff",
    status: "active",
    valid_from: "2026-01-01T00:00:00.000Z",
    valid_until: null,
    last_verified_at: "2026-11-17T11:00:00.000Z",
  };
}

function teamAssignmentRow(organizationId = "org-a", teamId = "team-a"): unknown {
  return {
    organization_id: organizationId,
    auth_subject: "subject-a",
    team_id: teamId,
    session_id: null,
    scope_kind: "team",
    status: "active",
    valid_from: "2026-01-01T00:00:00.000Z",
    valid_until: null,
    last_verified_at: "2026-11-17T11:00:00.000Z",
  };
}

function sessionAssignmentRow(sessionId = "session-a"): unknown {
  return {
    organization_id: "org-a",
    auth_subject: "subject-a",
    team_id: null,
    session_id: sessionId,
    scope_kind: "session",
    status: "active",
    valid_from: "2026-01-01T00:00:00.000Z",
    valid_until: null,
    last_verified_at: "2026-11-17T11:00:00.000Z",
  };
}

function boundaryProvider(): AuthenticationProvider {
  return {
    async authenticate() {
      return { subject: "subject-a" };
    },
  };
}

const resolvedSessionScope: ResolvedResourceScope = {
  organizationId: "org-a",
  teamId: "team-a",
  sessionId: "session-a",
};

const fixedNow = () => new Date("2026-11-17T12:00:00.000Z");

describe("APSI authorization database source", () => {
  it("uses the session's database-resolved team for team assignment coverage", async () => {
    const database = createSupabaseTestClient([
      queryResponse(sessionRow()),
      queryResponse(membershipRow()),
      queryResponse(),
      queryResponse(teamAssignmentRow()),
    ]);
    const dataSource = createApsiAuthorizationDataSource(() => database.client);
    const result = await authorizeAttendanceOperation(
      new Request("https://unit.test/attendance"),
      "markAttendance",
      { kind: "session", id: "session-a" },
      { authenticationProvider: boundaryProvider(), dataSource, now: fixedNow },
    );

    expect(result.scope).toEqual(resolvedSessionScope);
    expect(database.calls[2]).toMatchObject({
      table: "apsi_coach_assignments",
      filters: expect.arrayContaining([
        { kind: "eq", column: "scope_kind", value: "session" },
        { kind: "eq", column: "session_id", value: "session-a" },
      ]),
    });
    expect(database.calls[3]).toMatchObject({
      table: "apsi_coach_assignments",
      filters: expect.arrayContaining([
        { kind: "eq", column: "organization_id", value: "org-a" },
        { kind: "eq", column: "scope_kind", value: "team" },
        { kind: "eq", column: "team_id", value: "team-a" },
      ]),
    });
  });

  it("allows an exact session assignment", async () => {
    const database = createSupabaseTestClient([
      queryResponse(sessionRow()),
      queryResponse(membershipRow()),
      queryResponse(sessionAssignmentRow()),
    ]);
    const result = await authorizeAttendanceOperation(
      new Request("https://unit.test/attendance"),
      "markAttendance",
      { kind: "session", id: "session-a" },
      {
        authenticationProvider: boundaryProvider(),
        dataSource: createApsiAuthorizationDataSource(() => database.client),
        now: fixedNow,
      },
    );

    expect(result.scope).toEqual(resolvedSessionScope);
    expect(database.calls.at(2)?.filters).toContainEqual({
      kind: "eq",
      column: "session_id",
      value: "session-a",
    });
  });

  it("denies a session assignment for a different session", async () => {
    const database = createSupabaseTestClient([
      queryResponse(sessionRow()),
      queryResponse(membershipRow()),
      queryResponse(sessionAssignmentRow("session-other")),
      queryResponse(),
    ]);

    await expect(
      authorizeAttendanceOperation(
        new Request("https://unit.test/attendance"),
        "markAttendance",
        { kind: "session", id: "session-a" },
        {
          authenticationProvider: boundaryProvider(),
          dataSource: createApsiAuthorizationDataSource(() => database.client),
          now: fixedNow,
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(database.calls.at(2)?.filters).toContainEqual({
      kind: "eq",
      column: "session_id",
      value: "session-a",
    });
  });

  it("denies a team assignment when the stored session belongs to another team", async () => {
    const database = createSupabaseTestClient([
      queryResponse(sessionRow("org-a", "team-b")),
      queryResponse(membershipRow()),
      queryResponse(),
      queryResponse(),
    ]);

    await expect(
      authorizeAttendanceOperation(
        new Request("https://unit.test/attendance"),
        "markAttendance",
        { kind: "session", id: "session-a" },
        {
          authenticationProvider: boundaryProvider(),
          dataSource: createApsiAuthorizationDataSource(() => database.client),
          now: fixedNow,
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(database.calls.at(3)?.filters).toContainEqual({
      kind: "eq",
      column: "team_id",
      value: "team-b",
    });
  });

  it("denies mismatched organization membership data", async () => {
    const database = createSupabaseTestClient([
      queryResponse(sessionRow("org-b")),
      queryResponse(membershipRow("org-a")),
    ]);

    await expect(
      authorizeAttendanceOperation(
        new Request("https://unit.test/attendance"),
        "markAttendance",
        { kind: "session", id: "session-a" },
        {
          authenticationProvider: boundaryProvider(),
          dataSource: createApsiAuthorizationDataSource(() => database.client),
          now: fixedNow,
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(database.calls.at(1)?.filters).toContainEqual({
      kind: "eq",
      column: "organization_id",
      value: "org-b",
    });
  });

  it("denies ambiguous active assignments", async () => {
    const database = createSupabaseTestClient([
      queryResponse(sessionRow()),
      queryResponse(membershipRow()),
      queryResponse(),
      queryResponse(teamAssignmentRow(), teamAssignmentRow()),
    ]);

    await expect(
      authorizeAttendanceOperation(
        new Request("https://unit.test/attendance"),
        "markAttendance",
        { kind: "session", id: "session-a" },
        {
          authenticationProvider: boundaryProvider(),
          dataSource: createApsiAuthorizationDataSource(() => database.client),
          now: fixedNow,
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("maps database query errors to unavailable authorization", async () => {
    const database = createSupabaseTestClient([
      { data: null, error: new Error("database unavailable") },
    ]);

    await expect(
      authorizeAttendanceOperation(
        new Request("https://unit.test/attendance"),
        "markAttendance",
        { kind: "session", id: "session-a" },
        {
          authenticationProvider: boundaryProvider(),
          dataSource: createApsiAuthorizationDataSource(() => database.client),
          now: fixedNow,
        },
      ),
    ).rejects.toBeInstanceOf(AuthorizationUnavailableError);
  });

  it("keeps organization-scoped grants available for resources in that organization", async () => {
    const database = createSupabaseTestClient([
      queryResponse({
        organization_id: "org-a",
        auth_subject: "subject-a",
        permission: "reviewAttendance",
        status: "active",
        scope_kind: "organization",
        team_id: null,
        session_id: null,
        valid_from: "2026-01-01T00:00:00.000Z",
        valid_until: null,
        last_verified_at: "2026-11-17T11:00:00.000Z",
      }),
    ]);
    const dataSource = createApsiAuthorizationDataSource(() => database.client);

    await expect(
      dataSource.findPermissionGrant("subject-a", "reviewAttendance", resolvedSessionScope),
    ).resolves.toMatchObject({
      organizationId: "org-a",
      permission: "reviewAttendance",
      scope: { kind: "organization", id: "org-a" },
    });
    expect(database.calls.at(0)?.filters).toContainEqual({
      kind: "in",
      column: "scope_kind",
      value: ["organization", "session"],
    });
  });
});
