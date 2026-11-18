import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCookies, setCookie, setResponseHeader } from "@tanstack/react-start/server";

export interface SupabaseEnvironment {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

export interface SupabaseConfiguration {
  readonly url: string;
  readonly publishableKey: string;
}

export class SupabaseConfigurationError extends Error {
  readonly missingVariables: readonly string[];
  readonly invalidVariables: readonly string[];

  constructor(missingVariables: readonly string[] = [], invalidVariables: readonly string[] = []) {
    super("Supabase environment configuration is missing or invalid.");
    this.name = "SupabaseConfigurationError";
    this.missingVariables = missingVariables;
    this.invalidVariables = invalidVariables;
  }
}

export function readSupabaseConfiguration(
  environment: SupabaseEnvironment = process.env,
): SupabaseConfiguration {
  const url = environment.VITE_SUPABASE_URL?.trim();
  const publishableKey = environment.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  const missingVariables: string[] = [];

  if (!url) {
    missingVariables.push("VITE_SUPABASE_URL");
  }
  if (!publishableKey) {
    missingVariables.push("VITE_SUPABASE_PUBLISHABLE_KEY");
  }
  if (missingVariables.length > 0 || !url || !publishableKey) {
    throw new SupabaseConfigurationError(missingVariables);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new SupabaseConfigurationError([], ["VITE_SUPABASE_URL"]);
  }

  const localHttp = parsedUrl.protocol === "http:" && isLocalSupabaseHostname(parsedUrl.hostname);
  if (
    (parsedUrl.protocol !== "https:" && !localHttp) ||
    parsedUrl.username.length > 0 ||
    parsedUrl.password.length > 0
  ) {
    throw new SupabaseConfigurationError([], ["VITE_SUPABASE_URL"]);
  }

  return { url, publishableKey };
}

function isLocalSupabaseHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "::1" ||
    /^127(?:\.\d{1,3}){3}$/.test(normalized)
  );
}

export function createRequestScopedSupabaseClient(): SupabaseClient {
  const { url, publishableKey } = readSupabaseConfiguration();

  return createServerClient(url, publishableKey, {
    cookieOptions: {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env["NODE_ENV"] === "production",
    },
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet, cacheHeaders) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options);
        }

        for (const [name, value] of Object.entries(cacheHeaders)) {
          setResponseHeader(name, value);
        }
      },
    },
  });
}
