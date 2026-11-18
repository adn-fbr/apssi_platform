import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: unknown) => config,
  Link: ({ children, to, ...props }: React.ComponentProps<"a"> & { to: string }) =>
    React.createElement("a", { href: to, ...props }, children),
}));

import { activeTab, ownerOf, resolveRole, roleById } from "@/lib/role-navigation";
import { RoleContext } from "@/lib/roles-context";
import { roles } from "@/lib/roles-data";
import { Index } from "@/routes/index";

describe("role-aware navigation", () => {
  it("keeps role lookup and route ownership behavior", () => {
    expect(roleById("coach").id).toBe("coach");
    expect(roleById("unknown" as "coach").id).toBe("parent");
    expect(ownerOf("/ssb/finance")).toBe("ssb");
    expect(ownerOf("/")).toBeUndefined();
  });

  it("selects the most specific matching tab", () => {
    expect(activeTab(roleById("ssb").tabs, "/ssb/finance")).toBe("/ssb/finance");
    expect(activeTab(roleById("ssb").tabs, "/ssb/finance/ledger")).toBe("/ssb/finance");
    expect(activeTab(roleById("ssb").tabs, "/ssb/unknown")).toBe("/ssb");
  });

  it("keeps the current role on shared pages like Notifikasi and Akun", () => {
    expect(resolveRole("coach", "/notifications")).toBe("coach");
    expect(resolveRole("referee", "/account")).toBe("referee");
  });

  it("switches to the owner role when opening a role-only page", () => {
    expect(resolveRole("coach", "/parent/consent")).toBe("parent");
    expect(resolveRole("parent", "/association/verification")).toBe("association");
  });

  it("renders a role-based workspace summary from the active role context", () => {
    render(
      React.createElement(
        RoleContext.Provider,
        { value: { role: roles[2]!, setRole: vi.fn() } },
        React.createElement(Index),
      ),
    );

    expect(screen.getAllByText(/workspace/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/admin ssb/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /open dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /switch workspace/i }).length).toBeGreaterThan(0);
    expect(
      screen
        .getAllByRole("link", { name: /roster/i })
        .some((link) => link.getAttribute("href") === "/ssb/roster"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: /latihan/i })
        .some((link) => link.getAttribute("href") === "/ssb/training"),
    ).toBe(true);
    expect(screen.getByText(/no live operational data yet/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/prototype/i).length).toBeGreaterThan(0);
  });
});
