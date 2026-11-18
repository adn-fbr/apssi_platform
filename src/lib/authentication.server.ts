import type { SupabaseClient } from "@supabase/supabase-js";

import { createRequestScopedSupabaseClient, SupabaseConfigurationError } from "./supabase.server";

export interface AuthenticatedIdentity {
  readonly subject: string;
}

export interface AuthenticationProvider {
  authenticate(request: Request): Promise<AuthenticatedIdentity | null>;
}

export class UnauthenticatedError extends Error {
  readonly statusCode = 401;
  readonly code = "unauthenticated";

  constructor() {
    super("Authentication required.");
    this.name = "UnauthenticatedError";
  }
}

export class AuthenticationUnavailableError extends Error {
  readonly statusCode = 503;
  readonly code = "authentication_unavailable";

  constructor() {
    super("Authentication provider is unavailable.");
    this.name = "AuthenticationUnavailableError";
  }
}

export type SupabaseAuthClient = Pick<SupabaseClient, "auth">;

export type SupabaseClientFactory = (
  request: Request,
) => SupabaseAuthClient | Promise<SupabaseAuthClient>;

export type AuthenticationState = "authenticated" | "unauthenticated" | "unavailable";
export type PasswordSignInResult =
  "signed_in" | "invalid_input" | "invalid_credentials" | "unavailable";
export type PasswordSignOutResult = "signed_out" | "signed_out_unconfirmed" | "unavailable";

export function createSupabaseAuthenticationProvider(
  clientFactory: SupabaseClientFactory = createRequestScopedSupabaseClient,
): AuthenticationProvider {
  return {
    async authenticate(request) {
      try {
        const client = await clientFactory(request);
        const { data, error } = await client.auth.getClaims();

        if (error != null) {
          if (isInvalidSessionError(error)) {
            return null;
          }

          throw new AuthenticationUnavailableError();
        }

        const subject = getClaimSubject(data?.claims);
        return subject === null ? null : { subject };
      } catch (error) {
        if (error instanceof AuthenticationUnavailableError) {
          throw error;
        }

        if (error instanceof SupabaseConfigurationError) {
          throw new AuthenticationUnavailableError();
        }

        if (isInvalidSessionError(error)) {
          return null;
        }

        throw new AuthenticationUnavailableError();
      }
    },
  };
}

export const supabaseAuthenticationProvider = createSupabaseAuthenticationProvider();

export async function getAuthenticationState(
  request: Request,
  provider: AuthenticationProvider = supabaseAuthenticationProvider,
): Promise<AuthenticationState> {
  try {
    await requireAuthenticatedIdentity(request, provider);
    return "authenticated";
  } catch (error) {
    return error instanceof UnauthenticatedError ? "unauthenticated" : "unavailable";
  }
}

export async function signInWithEmailPassword(
  request: Request,
  email: string,
  password: string,
  clientFactory: SupabaseClientFactory = createRequestScopedSupabaseClient,
): Promise<PasswordSignInResult> {
  const normalizedEmail = email.trim();
  if (!isValidEmail(normalizedEmail) || password.length === 0) {
    return "invalid_input";
  }

  let client: SupabaseAuthClient;
  try {
    client = await clientFactory(request);
  } catch {
    return "unavailable";
  }

  try {
    const { error } = await client.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (error != null) {
      return isTransientAuthError(error) ? "unavailable" : "invalid_credentials";
    }

    const { data, error: claimsError } = await client.auth.getClaims();
    if (claimsError == null && getClaimSubject(data?.claims) !== null) {
      return "signed_in";
    }

    await client.auth.signOut({ scope: "local" }).catch(() => undefined);
    return "unavailable";
  } catch (error) {
    return isTransientAuthError(error) ? "unavailable" : "invalid_credentials";
  }
}

export async function signOutCurrentSession(
  request: Request,
  clientFactory: SupabaseClientFactory = createRequestScopedSupabaseClient,
): Promise<PasswordSignOutResult> {
  let client: SupabaseAuthClient;
  try {
    client = await clientFactory(request);
  } catch {
    return "unavailable";
  }

  try {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error == null || isMissingSessionError(error)) {
      return "signed_out";
    }
    return "signed_out_unconfirmed";
  } catch (error) {
    return isMissingSessionError(error) ? "signed_out" : "signed_out_unconfirmed";
  }
}

export async function requireAuthenticatedIdentity(
  request: Request,
  provider: AuthenticationProvider = supabaseAuthenticationProvider,
): Promise<AuthenticatedIdentity> {
  let identity: AuthenticatedIdentity | null;

  try {
    identity = await provider.authenticate(request);
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof AuthenticationUnavailableError) {
      throw error;
    }

    throw new AuthenticationUnavailableError();
  }

  if (
    identity == null ||
    typeof identity.subject !== "string" ||
    identity.subject.trim().length === 0
  ) {
    throw new UnauthenticatedError();
  }

  return Object.freeze({ subject: identity.subject.trim() });
}

function getClaimSubject(claims: unknown): string | null {
  if (typeof claims !== "object" || claims === null || Array.isArray(claims)) {
    return null;
  }

  const subject = (claims as Record<string, unknown>)["sub"];
  return typeof subject === "string" && subject.trim().length > 0 ? subject.trim() : null;
}

function isInvalidSessionError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const authError = error as { name?: unknown; status?: unknown };
  if (authError.name === "AuthRetryableFetchError" || authError.name === "AuthUnknownError") {
    return false;
  }

  if (authError.name === "AuthSessionMissingError" || authError.name === "AuthInvalidJwtError") {
    return true;
  }

  return (
    authError.name === "AuthApiError" &&
    (authError.status === 400 || authError.status === 401 || authError.status === 403)
  );
}

function isTransientAuthError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true;
  }
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const authError = error as { name?: unknown; status?: unknown };
  return (
    authError.name === "AuthRetryableFetchError" ||
    authError.name === "AuthUnknownError" ||
    authError.status === 0 ||
    authError.status === 429 ||
    (typeof authError.status === "number" && authError.status >= 500)
  );
}

function isMissingSessionError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const authError = error as { name?: unknown; status?: unknown };
  return (
    authError.name === "AuthSessionMissingError" ||
    authError.status === 401 ||
    authError.status === 403 ||
    authError.status === 404
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
