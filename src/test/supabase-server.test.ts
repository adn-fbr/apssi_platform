import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getCookies: vi.fn(),
  setCookie: vi.fn(),
  setResponseHeader: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("@tanstack/react-start/server", () => ({
  getCookies: mocks.getCookies,
  setCookie: mocks.setCookie,
  setResponseHeader: mocks.setResponseHeader,
}));

import { createRequestScopedSupabaseClient } from "@/lib/supabase.server";

describe("request-scoped Supabase server client", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://unit-test.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "unit-test-publishable-key");
    mocks.getCookies.mockReturnValue({ "sb-test-auth-token": "opaque-test-cookie" });
    mocks.createServerClient.mockImplementation((_url, _key, options) => ({ options }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("uses request cookies, secure cookie defaults, and propagates refresh cookies and cache headers", () => {
    const client = createRequestScopedSupabaseClient() as unknown as {
      options: {
        cookieOptions: Record<string, unknown>;
        cookies: {
          getAll: () => { name: string; value: string }[];
          setAll: (
            cookies: { name: string; value: string; options: { path: string } }[],
            headers: Record<string, string>,
          ) => void;
        };
      };
    };

    expect(client.options.cookies.getAll()).toEqual([
      { name: "sb-test-auth-token", value: "opaque-test-cookie" },
    ]);
    expect(client.options.cookieOptions).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });

    const cookieOptions = { path: "/" };
    const cacheHeaders = {
      "Cache-Control": "private, no-store",
      Expires: "0",
      Pragma: "no-cache",
    };
    client.options.cookies.setAll(
      [{ name: "sb-test-auth-token", value: "rotated-test-cookie", options: cookieOptions }],
      cacheHeaders,
    );

    expect(mocks.setCookie).toHaveBeenCalledWith(
      "sb-test-auth-token",
      "rotated-test-cookie",
      cookieOptions,
    );
    expect(mocks.setResponseHeader).toHaveBeenCalledTimes(3);
    expect(mocks.setResponseHeader).toHaveBeenCalledWith("Cache-Control", "private, no-store");
    expect(mocks.setResponseHeader).toHaveBeenCalledWith("Expires", "0");
    expect(mocks.setResponseHeader).toHaveBeenCalledWith("Pragma", "no-cache");
  });

  it("sets Secure cookies in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const client = createRequestScopedSupabaseClient() as unknown as {
      options: { cookieOptions: Record<string, unknown> };
    };

    expect(client.options.cookieOptions["secure"]).toBe(true);
    expect(client.options.cookieOptions["httpOnly"]).toBe(true);
  });

  it("creates a new Supabase SSR client for every request", () => {
    createRequestScopedSupabaseClient();
    createRequestScopedSupabaseClient();

    expect(mocks.createServerClient).toHaveBeenCalledTimes(2);
  });
});
