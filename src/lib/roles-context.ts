import { createContext, useContext } from "react";
import type { Role, RoleId } from "./roles-data";

type Ctx = { role: Role; setRole: (id: RoleId) => void };

export const RoleContext = createContext<Ctx | null>(null);

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
