import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { RoleContext } from "./roles-context";
import { ownerOf, resolveRole, roleById } from "./role-navigation";
import { roles, type Role, type RoleId } from "./roles-data";

export type { AppPath, NavTab, Role, RoleId } from "./roles-data";

const STORAGE_KEY = "bolaid.role";
const DEFAULT_ROLE: RoleId = "parent";

export function RoleProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Derived from the URL only, so server and client render the same first frame.
  const [roleId, setRoleId] = useState<RoleId>(() => ownerOf(pathname) ?? DEFAULT_ROLE);

  // After hydration, restore the last chosen role on shared pages (Jadwal, Turnamen…).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as RoleId | null;
    if (saved && roles.some((r) => r.id === saved))
      setRoleId((cur) => resolveRole(saved, pathname) ?? cur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRoleId((cur) => resolveRole(cur, pathname));
  }, [pathname]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, roleId);
  }, [roleId]);

  return (
    <RoleContext.Provider value={{ role: roleById(roleId), setRole: setRoleId }}>
      {children}
    </RoleContext.Provider>
  );
}
