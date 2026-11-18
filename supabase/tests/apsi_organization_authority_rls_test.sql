BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SET LOCAL search_path = extensions, public, auth;

SELECT no_plan();

INSERT INTO auth.users (id, email) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'no-membership@example.test'),
    ('a0000000-0000-0000-0000-000000000002', 'pending@example.test'),
    ('a0000000-0000-0000-0000-000000000003', 'suspended@example.test'),
    ('a0000000-0000-0000-0000-000000000004', 'revoked@example.test'),
    ('a0000000-0000-0000-0000-000000000005', 'member-only@example.test'),
    ('a0000000-0000-0000-0000-000000000006', 'session-coach@example.test'),
    ('a0000000-0000-0000-0000-000000000007', 'team-coach@example.test'),
    ('a0000000-0000-0000-0000-000000000008', 'other-session-coach@example.test'),
    ('a0000000-0000-0000-0000-000000000009', 'reviewer@example.test'),
    ('a0000000-0000-0000-0000-000000000010', 'corrector@example.test'),
    ('a0000000-0000-0000-0000-000000000011', 'membership-manager@example.test'),
    ('a0000000-0000-0000-0000-000000000012', 'assignment-manager@example.test'),
    ('a0000000-0000-0000-0000-000000000013', 'cross-org-reviewer@example.test'),
    ('a0000000-0000-0000-0000-000000000014', 'player@example.test'),
    ('a0000000-0000-0000-0000-000000000015', 'guardian@example.test'),
    ('a0000000-0000-0000-0000-000000000016', 'team-reviewer@example.test'),
    ('a0000000-0000-0000-0000-000000000017', 'session-reviewer@example.test'),
    ('a0000000-0000-0000-0000-000000000018', 'archived-coach@example.test'),
    ('a0000000-0000-0000-0000-000000000019', 'deleted-coach@example.test'),
    ('a0000000-0000-0000-0000-000000000020', 'expired-grant@example.test'),
    ('a0000000-0000-0000-0000-000000000021', 'suspended-grant@example.test'),
    ('a0000000-0000-0000-0000-000000000022', 'revoked-grant@example.test'),
    ('a0000000-0000-0000-0000-000000000023', 'unverified-grant@example.test'),
    ('a0000000-0000-0000-0000-000000000024', 'future-verification-grant@example.test'),
    ('a0000000-0000-0000-0000-000000000025', 'future-grant@example.test'),
    ('a0000000-0000-0000-0000-000000000026', 'wrong-team-grant@example.test'),
    ('a0000000-0000-0000-0000-000000000027', 'expired-assignment@example.test'),
    ('a0000000-0000-0000-0000-000000000028', 'suspended-assignment@example.test'),
    ('a0000000-0000-0000-0000-000000000029', 'revoked-assignment@example.test'),
    ('a0000000-0000-0000-0000-000000000030', 'unverified-assignment@example.test'),
    ('a0000000-0000-0000-0000-000000000031', 'future-assignment@example.test'),
    ('a0000000-0000-0000-0000-000000000032', 'team-corrector@example.test'),
    ('a0000000-0000-0000-0000-000000000033', 'cross-org-team-reviewer@example.test');

INSERT INTO public.apsi_organizations (id, code, name, status) VALUES
    ('10000000-0000-0000-0000-000000000001', 'org-a', 'Organization A', 'active'),
    ('10000000-0000-0000-0000-000000000002', 'org-b', 'Organization B', 'active'),
    ('10000000-0000-0000-0000-000000000004', 'org-c', 'Organization C', 'archived'),
    ('10000000-0000-0000-0000-000000000005', 'org-d', 'Organization D', 'deleted');

INSERT INTO public.apsi_teams (id, organization_id, code, name) VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'team-a1', 'Team A1'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'team-a2', 'Team A2'),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'team-b1', 'Team B1'),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'team-c1', 'Team C1'),
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'team-d1', 'Team D1');

INSERT INTO public.apsi_training_sessions (
    id, organization_id, team_id, code, title, scheduled_for
) VALUES
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'session-a1', 'Session A1', now()),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'session-a2', 'Session A2', now()),
    ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'session-b1', 'Session B1', now()),
    ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'session-c1', 'Session C1', now()),
    ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 'session-d1', 'Session D1', now());

INSERT INTO public.apsi_organization_memberships (
    organization_id, auth_subject, actor_type, status, last_verified_at
) VALUES
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'staff', 'pending', NULL),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'staff', 'suspended', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'staff', 'revoked', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000008', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000011', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000012', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000013', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000014', 'player', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000015', 'guardian', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000016', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000017', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000007', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000018', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000007', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000019', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000020', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000021', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000022', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000023', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000024', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000025', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000026', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000027', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000028', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000029', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000030', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000031', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000032', 'staff', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000033', 'staff', 'active', now());

INSERT INTO public.apsi_coach_assignments (
    organization_id, auth_subject, session_id, scope_kind, status, last_verified_at
) VALUES
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', 'session', 'active', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000002', 'session', 'active', now()),
    ('10000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000018', '30000000-0000-0000-0000-000000000004', 'session', 'active', now()),
    ('10000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000019', '30000000-0000-0000-0000-000000000005', 'session', 'active', now());

INSERT INTO public.apsi_coach_assignments (
    organization_id, auth_subject, team_id, scope_kind, status, valid_from, valid_until, last_verified_at
) VALUES
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', 'team', 'active', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000004', 'team', 'active', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000005', 'team', 'active', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000027', '20000000-0000-0000-0000-000000000002', 'team', 'active', now() - interval '2 day', now() - interval '1 day', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000028', '20000000-0000-0000-0000-000000000002', 'team', 'suspended', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000029', '20000000-0000-0000-0000-000000000002', 'team', 'revoked', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000030', '20000000-0000-0000-0000-000000000002', 'team', 'pending', now() - interval '1 day', NULL, NULL),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000031', '20000000-0000-0000-0000-000000000002', 'team', 'active', now() + interval '1 day', NULL, now());

INSERT INTO public.apsi_administrative_grants (
    organization_id, auth_subject, permission, status, scope_kind, last_verified_at
) VALUES
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009', 'reviewAttendance', 'active', 'organization', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', 'correctAttendance', 'active', 'organization', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000011', 'manageMembership', 'active', 'organization', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000012', 'manageAssignments', 'active', 'organization', now()),
    ('10000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000013', 'reviewAttendance', 'active', 'organization', now());

INSERT INTO public.apsi_administrative_grants (
    organization_id, auth_subject, permission, status, scope_kind, team_id, valid_from, valid_until, last_verified_at
) VALUES
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000016', 'reviewAttendance', 'active', 'team', '20000000-0000-0000-0000-000000000002', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000020', 'reviewAttendance', 'active', 'team', '20000000-0000-0000-0000-000000000002', now() - interval '2 day', now() - interval '1 day', now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000021', 'reviewAttendance', 'suspended', 'team', '20000000-0000-0000-0000-000000000002', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000022', 'reviewAttendance', 'revoked', 'team', '20000000-0000-0000-0000-000000000002', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000023', 'reviewAttendance', 'pending', 'team', '20000000-0000-0000-0000-000000000002', now() - interval '1 day', NULL, NULL),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000024', 'reviewAttendance', 'active', 'team', '20000000-0000-0000-0000-000000000002', now() - interval '1 day', NULL, now() + interval '1 day'),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000025', 'reviewAttendance', 'active', 'team', '20000000-0000-0000-0000-000000000002', now() + interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000026', 'reviewAttendance', 'active', 'team', '20000000-0000-0000-0000-000000000001', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000032', 'correctAttendance', 'active', 'team', '20000000-0000-0000-0000-000000000002', now() - interval '1 day', NULL, now()),
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000033', 'reviewAttendance', 'active', 'team', '20000000-0000-0000-0000-000000000001', now() - interval '1 day', NULL, now());

INSERT INTO public.apsi_administrative_grants (
    organization_id, auth_subject, permission, status, scope_kind, session_id, last_verified_at
) VALUES
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000017', 'reviewAttendance', 'active', 'session', '30000000-0000-0000-0000-000000000002', now());

SELECT ok(
    (SELECT count(*) = 6
     FROM pg_class relation
     JOIN pg_namespace namespace ON namespace.oid = relation.relnamespace
     WHERE namespace.nspname = 'public'
       AND relation.relname IN (
           'apsi_organizations', 'apsi_teams', 'apsi_training_sessions',
           'apsi_organization_memberships', 'apsi_coach_assignments', 'apsi_administrative_grants'
       )
       AND relation.relrowsecurity
       AND relation.relforcerowsecurity),
    'RLS is enabled and forced on all authority tables'
);

SELECT ok(
    NOT EXISTS (
        SELECT 1
        FROM unnest(ARRAY[
            'apsi_organizations', 'apsi_teams', 'apsi_training_sessions',
            'apsi_organization_memberships', 'apsi_coach_assignments', 'apsi_administrative_grants'
        ]) AS tables(table_name)
        CROSS JOIN unnest(ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']) AS privileges(privilege_name)
        WHERE has_table_privilege('anon', 'public.' || table_name, privilege_name)
    ),
    'anon has no table privileges on any authority table'
);
SELECT ok(
    NOT EXISTS (
        SELECT 1
        FROM unnest(ARRAY[
            'apsi_organizations', 'apsi_teams', 'apsi_training_sessions',
            'apsi_organization_memberships', 'apsi_coach_assignments', 'apsi_administrative_grants'
        ]) AS tables(table_name)
        CROSS JOIN unnest(ARRAY['INSERT', 'UPDATE', 'DELETE']) AS privileges(privilege_name)
        WHERE has_table_privilege('authenticated', 'public.' || table_name, privilege_name)
    ),
    'authenticated has no INSERT, UPDATE, or DELETE privileges on authority tables'
);
SELECT ok(
    NOT EXISTS (
        SELECT 1
        FROM unnest(ARRAY[
            'apsi_organizations', 'apsi_teams', 'apsi_training_sessions',
            'apsi_organization_memberships', 'apsi_coach_assignments', 'apsi_administrative_grants'
        ]) AS tables(table_name)
        WHERE NOT has_table_privilege('authenticated', 'public.' || table_name, 'SELECT')
    ),
    'authenticated has SELECT privileges on all authority tables, subject to RLS'
);

SELECT ok(
    NOT has_table_privilege('anon', 'public.apsi_organizations', 'SELECT'),
    'anon has no SELECT grant on organizations'
);
SELECT ok(
    NOT has_table_privilege('authenticated', 'public.apsi_organization_memberships', 'UPDATE'),
    'authenticated cannot update membership authority'
);
SELECT ok(
    NOT has_table_privilege('authenticated', 'public.apsi_coach_assignments', 'UPDATE'),
    'authenticated cannot update assignment authority'
);
SELECT ok(
    NOT has_table_privilege('authenticated', 'public.apsi_administrative_grants', 'UPDATE'),
    'authenticated cannot update grant authority'
);

SET LOCAL ROLE anon;
SELECT throws_ok(
    $$SELECT * FROM public.apsi_organizations$$,
    '42501', NULL,
    'unauthenticated anon cannot access organization data'
);

SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000001';
SELECT is_empty(
    $$SELECT id FROM public.apsi_organizations$$,
    'authenticated identity without membership sees no organizations'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000002';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'pending membership does not authorize session access'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000003';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'suspended membership does not authorize session access'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000004';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'revoked membership does not authorize session access'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000005';
SELECT is_empty(
    $$SELECT id FROM public.apsi_teams$$,
    'active membership alone does not authorize team access'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'active membership alone does not authorize session access'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000006';
SELECT results_eq(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000001'$$,
    ARRAY['30000000-0000-0000-0000-000000000001'::uuid],
    'session assignment allows its exact session'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'session assignment does not authorize another session'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000007';
SELECT results_eq(
    $$SELECT id FROM public.apsi_teams WHERE id = '20000000-0000-0000-0000-000000000002'$$,
    ARRAY['20000000-0000-0000-0000-000000000002'::uuid],
    'team assignment allows its exact team'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_teams WHERE id = '20000000-0000-0000-0000-000000000001'$$,
    'assignment for another team cannot read that team'
);
SELECT results_eq(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    ARRAY['30000000-0000-0000-0000-000000000002'::uuid],
    'team assignment covers sessions belonging to that exact team'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000001'$$,
    'team assignment cannot read a session belonging to another team'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000018';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000004'$$,
    'coach cannot read a session in an archived organization'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000019';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000005'$$,
    'coach cannot read a session in a deleted organization'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000007';
SELECT is_empty(
    $$SELECT id FROM public.apsi_teams WHERE id = '20000000-0000-0000-0000-000000000004'$$,
    'team assignment cannot read a team in an archived organization'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_teams WHERE id = '20000000-0000-0000-0000-000000000005'$$,
    'team assignment cannot read a team in a deleted organization'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000004'$$,
    'team assignment cannot read a session in an archived organization'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000005'$$,
    'team assignment cannot read a session in a deleted organization'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000009';
SELECT results_eq(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000001'$$,
    ARRAY['30000000-0000-0000-0000-000000000001'::uuid],
    'organization-scoped review grant applies within its organization'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000003'$$,
    'organization-scoped review grant does not cross organizations'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000011';
SELECT is_empty(
    $$SELECT id FROM public.apsi_teams$$,
    'membership-management grant does not authorize team reads'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'membership-management grant does not authorize session reads'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000012';
SELECT is_empty(
    $$SELECT id FROM public.apsi_teams$$,
    'assignment-management grant does not authorize team reads'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'assignment-management grant does not authorize session reads'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000013';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000001'$$,
    'grant from another organization does not authorize this session'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000016';
SELECT results_eq(
    $$SELECT id FROM public.apsi_teams WHERE id = '20000000-0000-0000-0000-000000000002'$$,
    ARRAY['20000000-0000-0000-0000-000000000002'::uuid],
    'team-scoped review grant allows its exact team'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_teams WHERE id = '20000000-0000-0000-0000-000000000001'$$,
    'team-scoped review grant does not authorize another team'
);
SELECT results_eq(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    ARRAY['30000000-0000-0000-0000-000000000002'::uuid],
    'team-scoped administrative grant covers a matching session'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000001'$$,
    'team-scoped administrative grant does not cover a session in another team'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000020';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'expired team grant does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000021';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'suspended team grant does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000022';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'revoked team grant does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000023';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'unverified team grant does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000024';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'future verification timestamp does not authorize a team grant'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000025';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'future-dated team grant does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000026';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'grant for another team does not authorize a session'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000032';
SELECT results_eq(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    ARRAY['30000000-0000-0000-0000-000000000002'::uuid],
    'team-scoped correctAttendance grant allows a matching team session'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000033';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000003'$$,
    'team-scoped grant from organization A does not read organization B session'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000017';
SELECT results_eq(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    ARRAY['30000000-0000-0000-0000-000000000002'::uuid],
    'session-scoped review grant allows its exact session'
);
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000001'$$,
    'session-scoped review grant does not authorize another session'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000014';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'player identity is not staff authority'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000015';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions$$,
    'guardian identity is not staff authority'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000006';
SELECT results_eq(
    $$SELECT auth_subject FROM public.apsi_organization_memberships$$,
    ARRAY['a0000000-0000-0000-0000-000000000006'::uuid],
    'membership lookup exposes only the caller membership'
);
SELECT throws_ok(
    $$UPDATE public.apsi_organization_memberships SET status = 'active' WHERE auth_subject = auth.uid()$$,
    '42501', NULL,
    'authenticated cannot activate or change its own membership'
);
SELECT throws_ok(
    $$INSERT INTO public.apsi_organization_memberships (organization_id, auth_subject, actor_type, status) VALUES ('10000000-0000-0000-0000-000000000002', auth.uid(), 'staff', 'active')$$,
    '42501', NULL,
    'authenticated cannot insert membership in another organization'
);
SELECT throws_ok(
    $$UPDATE public.apsi_organizations SET id = '10000000-0000-0000-0000-000000000002' WHERE id = '10000000-0000-0000-0000-000000000001'$$,
    '42501', NULL,
    'authenticated cannot change organization identity'
);

RESET ROLE;
SELECT throws_ok(
    $$INSERT INTO public.apsi_coach_assignments (organization_id, auth_subject, team_id, scope_kind, status, last_verified_at) VALUES ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', 'team', 'active', now())$$,
    '23503', NULL,
    'composite assignment foreign key rejects a team from another organization'
);
SELECT throws_ok(
    $$INSERT INTO public.apsi_administrative_grants (organization_id, auth_subject, permission, status, scope_kind, session_id, last_verified_at) VALUES ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009', 'reviewAttendance', 'active', 'session', '30000000-0000-0000-0000-000000000003', now())$$,
    '23503', NULL,
    'composite grant foreign key rejects a session from another organization'
);
SELECT throws_ok(
    $$INSERT INTO public.apsi_organization_memberships (organization_id, auth_subject, actor_type, status, last_verified_at) VALUES ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'staff', 'active', now())$$,
    '23505', NULL,
    'partial unique index rejects duplicate active membership'
);

UPDATE public.apsi_coach_assignments
SET status = 'revoked'
WHERE auth_subject = 'a0000000-0000-0000-0000-000000000006'
  AND session_id = '30000000-0000-0000-0000-000000000001';
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000006';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000001'$$,
    'revoked assignment denies a subsequent scoped read'
);

SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000027';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'expired team assignment does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000028';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'suspended team assignment does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000029';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'revoked team assignment does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000030';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'unverified team assignment does not authorize a session'
);
SET LOCAL request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000031';
SELECT is_empty(
    $$SELECT id FROM public.apsi_training_sessions WHERE id = '30000000-0000-0000-0000-000000000002'$$,
    'future-dated team assignment does not authorize a session'
);

SELECT * FROM finish();
ROLLBACK;