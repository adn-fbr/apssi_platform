-- B-13H — authoritative APSI organization membership and assignment foundation
-- This is a local migration candidate only. It is not applied to a remote Supabase project.

BEGIN;

CREATE TABLE public.apsi_organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE CHECK (btrim(code) <> ''),
    name text NOT NULL CHECK (btrim(name) <> ''),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.apsi_teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL
        REFERENCES public.apsi_organizations (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    code text NOT NULL CHECK (btrim(code) <> ''),
    name text NOT NULL CHECK (btrim(name) <> ''),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organization_id, code),
    UNIQUE (organization_id, id)
);

CREATE TABLE public.apsi_training_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL
        REFERENCES public.apsi_organizations (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    team_id uuid,
    code text NOT NULL CHECK (btrim(code) <> ''),
    title text NOT NULL CHECK (btrim(title) <> ''),
    scheduled_for timestamptz NOT NULL,
    status text NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organization_id, code),
    UNIQUE (organization_id, id),
    FOREIGN KEY (organization_id, team_id)
        REFERENCES public.apsi_teams (organization_id, id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE public.apsi_organization_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL
        REFERENCES public.apsi_organizations (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    auth_subject uuid NOT NULL
        REFERENCES auth.users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    actor_type text NOT NULL CHECK (actor_type IN ('staff', 'player', 'guardian')),
    status text NOT NULL
        CHECK (status IN ('pending', 'active', 'suspended', 'revoked', 'ended', 'rejected')),
    valid_from timestamptz NOT NULL DEFAULT now(),
    valid_until timestamptz,
    last_verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (valid_until IS NULL OR valid_until > valid_from),
    CHECK (status <> 'active' OR last_verified_at IS NOT NULL)
);

CREATE TABLE public.apsi_coach_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL
        REFERENCES public.apsi_organizations (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    auth_subject uuid NOT NULL
        REFERENCES auth.users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    team_id uuid,
    session_id uuid,
    scope_kind text NOT NULL CHECK (scope_kind IN ('team', 'session')),
    status text NOT NULL
        CHECK (status IN ('pending', 'active', 'suspended', 'revoked', 'ended', 'rejected')),
    valid_from timestamptz NOT NULL DEFAULT now(),
    valid_until timestamptz,
    last_verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (
        (scope_kind = 'team' AND team_id IS NOT NULL AND session_id IS NULL)
        OR
        (scope_kind = 'session' AND session_id IS NOT NULL AND team_id IS NULL)
    ),
    CHECK (valid_until IS NULL OR valid_until > valid_from),
    CHECK (status <> 'active' OR last_verified_at IS NOT NULL),
    FOREIGN KEY (organization_id, team_id)
        REFERENCES public.apsi_teams (organization_id, id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    FOREIGN KEY (organization_id, session_id)
        REFERENCES public.apsi_training_sessions (organization_id, id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE public.apsi_administrative_grants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL
        REFERENCES public.apsi_organizations (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    auth_subject uuid NOT NULL
        REFERENCES auth.users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    permission text NOT NULL CHECK (
        permission IN ('reviewAttendance', 'correctAttendance', 'manageMembership', 'manageAssignments')
    ),
    status text NOT NULL
        CHECK (status IN ('pending', 'active', 'suspended', 'revoked', 'ended', 'rejected')),
    scope_kind text NOT NULL CHECK (scope_kind IN ('organization', 'team', 'session')),
    team_id uuid,
    session_id uuid,
    valid_from timestamptz NOT NULL DEFAULT now(),
    valid_until timestamptz,
    last_verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (
        (scope_kind = 'organization' AND team_id IS NULL AND session_id IS NULL)
        OR
        (scope_kind = 'team' AND team_id IS NOT NULL AND session_id IS NULL)
        OR
        (scope_kind = 'session' AND session_id IS NOT NULL AND team_id IS NULL)
    ),
    CHECK (valid_until IS NULL OR valid_until > valid_from),
    CHECK (status <> 'active' OR last_verified_at IS NOT NULL),
    FOREIGN KEY (organization_id, team_id)
        REFERENCES public.apsi_teams (organization_id, id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    FOREIGN KEY (organization_id, session_id)
        REFERENCES public.apsi_training_sessions (organization_id, id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX apsi_memberships_one_active_actor
    ON public.apsi_organization_memberships (organization_id, auth_subject, actor_type)
    WHERE status = 'active';

CREATE INDEX apsi_memberships_auth_subject
    ON public.apsi_organization_memberships (auth_subject);

CREATE INDEX apsi_memberships_org_subject_status
    ON public.apsi_organization_memberships (organization_id, auth_subject, actor_type, status);

CREATE UNIQUE INDEX apsi_assignments_one_active_team_scope
    ON public.apsi_coach_assignments (organization_id, auth_subject, team_id)
    WHERE status = 'active' AND scope_kind = 'team';

CREATE UNIQUE INDEX apsi_assignments_one_active_session_scope
    ON public.apsi_coach_assignments (organization_id, auth_subject, session_id)
    WHERE status = 'active' AND scope_kind = 'session';

CREATE INDEX apsi_assignments_auth_subject
    ON public.apsi_coach_assignments (auth_subject);

CREATE INDEX apsi_assignments_org_subject_status
    ON public.apsi_coach_assignments (organization_id, auth_subject, status, scope_kind);

CREATE INDEX apsi_assignments_org_team
    ON public.apsi_coach_assignments (organization_id, team_id)
    WHERE team_id IS NOT NULL;

CREATE INDEX apsi_assignments_org_session
    ON public.apsi_coach_assignments (organization_id, session_id)
    WHERE session_id IS NOT NULL;

CREATE UNIQUE INDEX apsi_grants_one_active_organization_scope
    ON public.apsi_administrative_grants (organization_id, auth_subject, permission)
    WHERE status = 'active' AND scope_kind = 'organization';

CREATE UNIQUE INDEX apsi_grants_one_active_team_scope
    ON public.apsi_administrative_grants (organization_id, auth_subject, permission, team_id)
    WHERE status = 'active' AND scope_kind = 'team';

CREATE UNIQUE INDEX apsi_grants_one_active_session_scope
    ON public.apsi_administrative_grants (organization_id, auth_subject, permission, session_id)
    WHERE status = 'active' AND scope_kind = 'session';

CREATE INDEX apsi_grants_auth_subject
    ON public.apsi_administrative_grants (auth_subject);

CREATE INDEX apsi_grants_org_subject_permission
    ON public.apsi_administrative_grants (organization_id, auth_subject, permission, status);

CREATE INDEX apsi_grants_org_team
    ON public.apsi_administrative_grants (organization_id, team_id)
    WHERE team_id IS NOT NULL;

CREATE INDEX apsi_grants_org_session
    ON public.apsi_administrative_grants (organization_id, session_id)
    WHERE session_id IS NOT NULL;

REVOKE ALL PRIVILEGES ON TABLE
    public.apsi_organizations,
    public.apsi_teams,
    public.apsi_training_sessions,
    public.apsi_organization_memberships,
    public.apsi_coach_assignments,
    public.apsi_administrative_grants
FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE
    public.apsi_organizations,
    public.apsi_teams,
    public.apsi_training_sessions,
    public.apsi_organization_memberships,
    public.apsi_coach_assignments,
    public.apsi_administrative_grants
TO authenticated;

ALTER TABLE public.apsi_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_teams FORCE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_training_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_organization_memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_coach_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_coach_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_administrative_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apsi_administrative_grants FORCE ROW LEVEL SECURITY;

CREATE POLICY organizations_select_active_staff
ON public.apsi_organizations
FOR SELECT TO authenticated
USING (
    status = 'active'
    AND EXISTS (
        SELECT 1
        FROM public.apsi_organization_memberships membership
        WHERE membership.organization_id = apsi_organizations.id
          AND membership.auth_subject = (SELECT auth.uid())
          AND membership.actor_type = 'staff'
          AND membership.status = 'active'
          AND membership.last_verified_at IS NOT NULL
          AND membership.last_verified_at <= now()
          AND membership.valid_from <= now()
          AND (membership.valid_until IS NULL OR membership.valid_until > now())
    )
);

CREATE POLICY memberships_select_self
ON public.apsi_organization_memberships
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL AND auth_subject = (SELECT auth.uid()));

CREATE POLICY coach_assignments_select_self
ON public.apsi_coach_assignments
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL AND auth_subject = (SELECT auth.uid()));

CREATE POLICY grants_select_self
ON public.apsi_administrative_grants
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL AND auth_subject = (SELECT auth.uid()));

CREATE POLICY teams_select_with_explicit_authority
ON public.apsi_teams
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.apsi_organizations organization
        WHERE organization.id = apsi_teams.organization_id
          AND organization.status = 'active'
    )
    AND EXISTS (
        SELECT 1
        FROM public.apsi_organization_memberships membership
        WHERE membership.organization_id = apsi_teams.organization_id
          AND membership.auth_subject = (SELECT auth.uid())
          AND membership.actor_type = 'staff'
          AND membership.status = 'active'
          AND membership.last_verified_at IS NOT NULL
          AND membership.last_verified_at <= now()
          AND membership.valid_from <= now()
          AND (membership.valid_until IS NULL OR membership.valid_until > now())
    )
    AND (
        EXISTS (
            SELECT 1
            FROM public.apsi_coach_assignments assignment
            WHERE assignment.organization_id = apsi_teams.organization_id
              AND assignment.auth_subject = (SELECT auth.uid())
              AND assignment.scope_kind = 'team'
              AND assignment.team_id = apsi_teams.id
              AND assignment.status = 'active'
              AND assignment.last_verified_at IS NOT NULL
              AND assignment.last_verified_at <= now()
              AND assignment.valid_from <= now()
              AND (assignment.valid_until IS NULL OR assignment.valid_until > now())
        )
        OR EXISTS (
            SELECT 1
            FROM public.apsi_administrative_grants grant_row
            WHERE grant_row.organization_id = apsi_teams.organization_id
              AND grant_row.auth_subject = (SELECT auth.uid())
              AND grant_row.permission IN (
                  'reviewAttendance', 'correctAttendance'
              )
              AND grant_row.status = 'active'
              AND grant_row.last_verified_at IS NOT NULL
              AND grant_row.last_verified_at <= now()
              AND grant_row.valid_from <= now()
              AND (grant_row.valid_until IS NULL OR grant_row.valid_until > now())
              AND (
                  grant_row.scope_kind = 'organization'
                  OR (grant_row.scope_kind = 'team' AND grant_row.team_id = apsi_teams.id)
              )
        )
    )
);

CREATE POLICY sessions_select_with_explicit_authority
ON public.apsi_training_sessions
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.apsi_organizations organization
        WHERE organization.id = apsi_training_sessions.organization_id
          AND organization.status = 'active'
    )
    AND EXISTS (
        SELECT 1
        FROM public.apsi_organization_memberships membership
        WHERE membership.organization_id = apsi_training_sessions.organization_id
          AND membership.auth_subject = (SELECT auth.uid())
          AND membership.actor_type = 'staff'
          AND membership.status = 'active'
          AND membership.last_verified_at IS NOT NULL
          AND membership.last_verified_at <= now()
          AND membership.valid_from <= now()
          AND (membership.valid_until IS NULL OR membership.valid_until > now())
    )
    AND (
        EXISTS (
            SELECT 1
            FROM public.apsi_coach_assignments assignment
            WHERE assignment.organization_id = apsi_training_sessions.organization_id
              AND assignment.auth_subject = (SELECT auth.uid())
              AND assignment.status = 'active'
              AND assignment.last_verified_at IS NOT NULL
              AND assignment.last_verified_at <= now()
              AND assignment.valid_from <= now()
              AND (assignment.valid_until IS NULL OR assignment.valid_until > now())
              AND (
                  (assignment.scope_kind = 'session' AND assignment.session_id = apsi_training_sessions.id)
                  OR
                  (assignment.scope_kind = 'team' AND assignment.team_id = apsi_training_sessions.team_id)
              )
        )
        OR EXISTS (
            SELECT 1
            FROM public.apsi_administrative_grants grant_row
            WHERE grant_row.organization_id = apsi_training_sessions.organization_id
              AND grant_row.auth_subject = (SELECT auth.uid())
              AND grant_row.permission IN (
                  'reviewAttendance', 'correctAttendance'
              )
              AND grant_row.status = 'active'
              AND grant_row.last_verified_at IS NOT NULL
              AND grant_row.last_verified_at <= now()
              AND grant_row.valid_from <= now()
              AND (grant_row.valid_until IS NULL OR grant_row.valid_until > now())
              AND (
                  grant_row.scope_kind = 'organization'
                  OR (grant_row.scope_kind = 'session' AND grant_row.session_id = apsi_training_sessions.id)
                  OR (grant_row.scope_kind = 'team' AND grant_row.team_id = apsi_training_sessions.team_id)
              )
        )
    )
);

COMMIT;
