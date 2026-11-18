import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigate, signIn } = vi.hoisted(() => ({
  navigate: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (configuration: unknown) => configuration,
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  redirect: vi.fn((options) => options),
  useNavigate: () => navigate,
}));

vi.mock("@/lib/authentication.functions", () => ({
  getAuthenticationStateFn: vi.fn().mockResolvedValue("unauthenticated"),
  signInWithEmailPasswordFn: (...args: unknown[]) => signIn(...args),
}));

import { LoginPage } from "@/routes/login";
import { requiresAuthenticatedUser } from "@/lib/authentication-routes";

describe("Email and password login route", () => {
  beforeEach(() => {
    navigate.mockReset();
    signIn.mockReset();
  });

  it.each([
    "/account",
    "/notifications",
    "/parent",
    "/parent/consent",
    "/player",
    "/schedule",
    "/payments",
  ])("requires authentication for %s", (pathname) => {
    expect(requiresAuthenticatedUser(pathname)).toBe(true);
  });

  it.each(["/", "/login", "/coach", "/ssb/training", "/referee", "/organizer"])(
    "leaves public entry and fixture-only prototype route %s accessible",
    (pathname) => {
      expect(requiresAuthenticatedUser(pathname)).toBe(false);
    },
  );

  it("validates required fields before calling the server", async () => {
    render(<LoginPage />);

    fireEvent.submit(screen.getByRole("form", { name: "Masuk" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Masukkan email yang valid dan kata sandi.",
    );
    expect(signIn).not.toHaveBeenCalled();
  });

  it("uses a generic message for invalid credentials and navigates after success", async () => {
    signIn.mockResolvedValueOnce("invalid_credentials").mockResolvedValueOnce("signed_in");
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Kata sandi"), {
      target: { value: "wrong-password" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Masuk" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email atau kata sandi tidak valid.",
    );

    fireEvent.submit(screen.getByRole("form", { name: "Masuk" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/", replace: true }));
  });

  it("prevents duplicate submissions while a request is pending", async () => {
    let resolveSignIn: ((result: "signed_in") => void) | undefined;
    signIn.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve;
        }),
    );
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Kata sandi"), {
      target: { value: "valid-password" },
    });
    const form = screen.getByRole("form", { name: "Masuk" });
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(signIn).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Memverifikasi…" })).toBeDisabled();

    resolveSignIn?.("signed_in");
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/", replace: true }));
  });
});
