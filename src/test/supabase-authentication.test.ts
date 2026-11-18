import { describe, expect, it, vi } from "vitest";

import {
  AuthenticationUnavailableError,
  UnauthenticatedError,
  createSupabaseAuthenticationProvider,
  getAuthenticationState,
  signInWithEmailPassword,
  signOutCurrentSession,
  requireAuthenticatedIdentity,
  type SupabaseAuthClient,
} from "@/lib/authentication.server";
import {
  AuthorizationUnavailableError,
  ForbiddenError,
  authorizeAttendanceOperation,
  type AuthorizationDataSource,
} from "@/lib/authorization.server";
import { readSupabaseConfiguration, SupabaseConfigurationError } from "@/lib/supabase.server";

const request = new Request("https://unit.test/protected");
const resource = { kind: "session", id: "test-session" } as const;

function providerForResult(result: unknown) {
  const getClaims = vi.fn().mockResolvedValue(result);
  const provider = createSupabaseAuthenticationProvider(
    () => ({ auth: { getClaims } }) as unknown as SupabaseAuthClient,
  );

  return { provider, getClaims };
}

function errorResult(error: unknown) {
  return { data: { claims: null }, error };
}

function createPasswordClient(
  options: {
    signInError?: unknown;
    claims?: unknown;
    claimsError?: unknown;
    signOutError?: unknown;
  } = {},
) {
  const auth = {
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: options.signInError ?? null }),
    getClaims: vi.fn().mockResolvedValue({
      data: { claims: options.claims ?? { sub: "verified-test-subject" } },
      error: options.claimsError ?? null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: options.signOutError ?? null }),
  };
  return { client: { auth } as unknown as SupabaseAuthClient, auth };
}

describe("Supabase server authentication provider", () => {
  it("reports authenticated, unauthenticated, and unavailable session states", async () => {
    const authenticated = providerForResult({
      data: { claims: { sub: "verified-test-subject" } },
      error: null,
    });
    const unauthenticated = providerForResult(errorResult({ name: "AuthSessionMissingError" }));
    const unavailable = createSupabaseAuthenticationProvider(async () => {
      throw new TypeError("fetch failed");
    });

    await expect(getAuthenticationState(request, authenticated.provider)).resolves.toBe(
      "authenticated",
    );
    await expect(getAuthenticationState(request, unauthenticated.provider)).resolves.toBe(
      "unauthenticated",
    );
    await expect(getAuthenticationState(request, unavailable)).resolves.toBe("unavailable");
  });

  it("returns only the subject from verified getClaims data", async () => {
    const { provider, getClaims } = providerForResult({
      data: {
        claims: {
          sub: "verified-subject",
          user_metadata: { role: "platform-operator", organization_id: "attacker-org" },
          app_metadata: { role: "ssb-admin" },
        },
      },
      error: null,
    });

    await expect(provider.authenticate(request)).resolves.toEqual({
      subject: "verified-subject",
    });
    expect(getClaims).toHaveBeenCalledOnce();
  });

  it("creates a separate Supabase client for each request", async () => {
    const firstRequest = new Request("https://unit.test/first");
    const secondRequest = new Request("https://unit.test/second");
    const clientFactory = vi
      .fn()
      .mockReturnValueOnce({
        auth: {
          getClaims: vi.fn().mockResolvedValue({
            data: { claims: { sub: "first-subject" } },
            error: null,
          }),
        },
      })
      .mockReturnValueOnce({
        auth: {
          getClaims: vi.fn().mockResolvedValue({
            data: { claims: { sub: "second-subject" } },
            error: null,
          }),
        },
      });
    const provider = createSupabaseAuthenticationProvider(
      clientFactory as unknown as (request: Request) => SupabaseAuthClient,
    );

    await expect(provider.authenticate(firstRequest)).resolves.toEqual({
      subject: "first-subject",
    });
    await expect(provider.authenticate(secondRequest)).resolves.toEqual({
      subject: "second-subject",
    });
    expect(clientFactory).toHaveBeenCalledTimes(2);
    expect(clientFactory).toHaveBeenNthCalledWith(1, firstRequest);
    expect(clientFactory).toHaveBeenNthCalledWith(2, secondRequest);
  });

  it.each([
    { name: "AuthSessionMissingError" },
    { name: "AuthInvalidJwtError" },
    { name: "AuthApiError", status: 400, code: "refresh_token_not_found" },
    { name: "AuthApiError", status: 401, code: "bad_jwt" },
  ])("returns unauthenticated for invalid or expired session errors", async (error) => {
    const { provider } = providerForResult(errorResult(error));
    await expect(provider.authenticate(request)).resolves.toBeNull();
  });

  it("returns unauthenticated when verified claims have no usable subject", async () => {
    for (const claims of [null, {}, { sub: "" }, { sub: 42 }, "not-claims"]) {
      const { provider } = providerForResult({ data: { claims }, error: null });
      await expect(provider.authenticate(request)).resolves.toBeNull();
    }
  });

  it.each([
    {
      environment: { VITE_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key" },
      missing: ["VITE_SUPABASE_URL"],
    },
    {
      environment: { VITE_SUPABASE_URL: "https://example.supabase.co" },
      missing: ["VITE_SUPABASE_PUBLISHABLE_KEY"],
    },
  ])("reports only missing Supabase environment names", ({ environment, missing }) => {
    try {
      readSupabaseConfiguration(environment);
      throw new Error("Expected configuration to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(SupabaseConfigurationError);
      expect((error as SupabaseConfigurationError).missingVariables).toEqual(missing);
    }
  });

  it("rejects malformed or non-local HTTP project URLs", () => {
    for (const url of ["not-a-url", "http://example.supabase.co"]) {
      try {
        readSupabaseConfiguration({
          VITE_SUPABASE_URL: url,
          VITE_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
        });
        throw new Error("Expected configuration to fail.");
      } catch (error) {
        expect(error).toBeInstanceOf(SupabaseConfigurationError);
        expect((error as SupabaseConfigurationError).missingVariables).toEqual([]);
        expect((error as SupabaseConfigurationError).invalidVariables).toEqual([
          "VITE_SUPABASE_URL",
        ]);
      }
    }
  });

  it.each(["http://localhost:54321", "http://127.0.0.1:54321", "http://[::1]:54321"])(
    "allows local Supabase development URL %s",
    (url) => {
      expect(
        readSupabaseConfiguration({
          VITE_SUPABASE_URL: url,
          VITE_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
        }).url,
      ).toBe(url);
    },
  );

  it("accepts HTTPS Supabase project URLs", () => {
    expect(
      readSupabaseConfiguration({
        VITE_SUPABASE_URL: "https://example.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
      }).url,
    ).toBe("https://example.supabase.co");
  });

  it("maps missing Supabase configuration to authentication unavailable", async () => {
    const provider = createSupabaseAuthenticationProvider(() => {
      throw new SupabaseConfigurationError(["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"]);
    });

    await expect(provider.authenticate(request)).rejects.toBeInstanceOf(
      AuthenticationUnavailableError,
    );
  });

  it("rejects missing credentials before creating an auth client", async () => {
    const clientFactory = vi.fn();

    await expect(signInWithEmailPassword(request, "", "password", clientFactory)).resolves.toBe(
      "invalid_input",
    );
    await expect(
      signInWithEmailPassword(request, "user@example.com", "", clientFactory),
    ).resolves.toBe("invalid_input");
    expect(clientFactory).not.toHaveBeenCalled();
  });

  it("signs in with email/password and requires verified claims before success", async () => {
    const { client, auth } = createPasswordClient({
      claims: {
        sub: "verified-test-subject",
        user_metadata: { role: "platform-operator" },
      },
    });

    await expect(
      signInWithEmailPassword(
        request,
        "  user@example.com  ",
        "correct horse battery staple",
        () => client,
      ),
    ).resolves.toBe("signed_in");
    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "correct horse battery staple",
    });
    expect(auth.getClaims).toHaveBeenCalledOnce();
    expect(auth.signOut).not.toHaveBeenCalled();
  });

  it("returns the same generic invalid-credentials result for account and password failures", async () => {
    for (const signInError of [
      { name: "AuthApiError", status: 400, code: "invalid_credentials" },
      { name: "AuthApiError", status: 400, code: "user_not_found" },
    ]) {
      const { client } = createPasswordClient({ signInError });
      await expect(
        signInWithEmailPassword(request, "user@example.com", "wrong-password", () => client),
      ).resolves.toBe("invalid_credentials");
    }
  });

  it("maps absent configuration and provider failures to unavailable", async () => {
    await expect(
      signInWithEmailPassword(request, "user@example.com", "password", () => {
        throw new SupabaseConfigurationError([
          "VITE_SUPABASE_URL",
          "VITE_SUPABASE_PUBLISHABLE_KEY",
        ]);
      }),
    ).resolves.toBe("unavailable");

    await expect(
      signInWithEmailPassword(request, "user@example.com", "password", async () => {
        throw new TypeError("fetch failed");
      }),
    ).resolves.toBe("unavailable");
  });

  it("clears the newly-established local session when claim verification fails", async () => {
    const { client, auth } = createPasswordClient({
      claimsError: { name: "AuthInvalidJwtError", status: 401 },
    });

    await expect(
      signInWithEmailPassword(request, "user@example.com", "password", () => client),
    ).resolves.toBe("unavailable");
    expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });

  it("signs out only the local session and treats already-missing sessions as complete", async () => {
    const { client, auth } = createPasswordClient({
      signOutError: { name: "AuthSessionMissingError" },
    });

    await expect(signOutCurrentSession(request, () => client)).resolves.toBe("signed_out");
    expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });

  it("reports when local logout could not be confirmed with the provider", async () => {
    const { client } = createPasswordClient({
      signOutError: { name: "AuthRetryableFetchError", status: 503 },
    });

    await expect(signOutCurrentSession(request, () => client)).resolves.toBe(
      "signed_out_unconfirmed",
    );
  });

  it("maps network and provider failures to authentication unavailable", async () => {
    const networkProvider = createSupabaseAuthenticationProvider(async () => {
      throw new TypeError("fetch failed");
    });
    const authProvider = createSupabaseAuthenticationProvider(
      () =>
        ({
          auth: {
            getClaims: vi.fn().mockResolvedValue(errorResult({ name: "AuthRetryableFetchError" })),
          },
        }) as unknown as SupabaseAuthClient,
    );

    await expect(networkProvider.authenticate(request)).rejects.toBeInstanceOf(
      AuthenticationUnavailableError,
    );
    await expect(authProvider.authenticate(request)).rejects.toBeInstanceOf(
      AuthenticationUnavailableError,
    );
  });

  it("does not return an identity when verification is unavailable", async () => {
    const provider = createSupabaseAuthenticationProvider(async () => {
      throw new TypeError("fetch failed");
    });

    await expect(requireAuthenticatedIdentity(request, provider)).rejects.toMatchObject({
      code: "authentication_unavailable",
      statusCode: 503,
    });
  });

  it("does not turn user metadata into attendance authorization", async () => {
    const { provider } = providerForResult({
      data: {
        claims: {
          sub: "verified-subject",
          user_metadata: { role: "coach", organization_id: "test-organization" },
        },
      },
      error: null,
    });
    const dataSource: AuthorizationDataSource = {
      async resolveResource() {
        return {
          organizationId: "test-organization",
          teamId: "test-team",
          sessionId: "test-session",
        };
      },
      async findMembership() {
        return null;
      },
      async findCoachAssignment() {
        return null;
      },
      async findPermissionGrant() {
        return null;
      },
    };

    await expect(
      authorizeAttendanceOperation(request, "markAttendance", resource, {
        authenticationProvider: provider,
        dataSource,
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("preserves fail-closed organization and assignment dependencies", async () => {
    const { provider } = providerForResult({
      data: { claims: { sub: "verified-subject" } },
      error: null,
    });

    await expect(
      authorizeAttendanceOperation(request, "markAttendance", resource, {
        authenticationProvider: provider,
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
});
