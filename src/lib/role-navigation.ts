import { roles, type NavTab, type RoleId } from "./roles-data";

export const roleById = (id: RoleId) => roles.find((r) => r.id === id) ?? roles[0]!;

const matches = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

/** The tab whose path is the longest match for the current pathname. */
export function activeTab(tabs: NavTab[], pathname: string) {
  return tabs.filter((t) => matches(pathname, t.to)).sort((a, b) => b.to.length - a.to.length)[0]
    ?.to;
}

/** Most specific role that owns this path (e.g. /ssb/finance -> ssb). */
export function ownerOf(pathname: string): RoleId | undefined {
  let best: { id: RoleId; len: number } | undefined;
  for (const r of roles) {
    for (const p of r.owns) {
      if (matches(pathname, p) && (!best || p.length > best.len))
        best = { id: r.id, len: p.length };
    }
  }
  return best?.id;
}

/** Role to use after a navigation: keep the current role if it has a tab for the path. */
export function resolveRole(current: RoleId, pathname: string): RoleId {
  if (activeTab(roleById(current).tabs, pathname)) return current;
  return ownerOf(pathname) ?? current;
}
