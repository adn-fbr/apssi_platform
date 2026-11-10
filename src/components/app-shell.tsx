import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Home, IdCard, Users, Shield, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/player", label: "Passport", icon: IdCard },
  { to: "/parent", label: "Keluarga", icon: Users },
  { to: "/ssb", label: "SSB", icon: Shield },
  { to: "/tournament", label: "Turnamen", icon: Trophy },
] as const;

export function Logo({ className, onDark }: { className?: string; onDark?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="BolaID beranda">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-signal">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-pitch-deep" />
        <span className="absolute inset-y-1.5 left-1/2 w-0.5 -translate-x-1/2 bg-pitch-deep/80" />
      </span>
      <span className={cn("font-display text-lg font-extrabold tracking-tight", onDark ? "text-sidebar-foreground" : "text-foreground")}>
        Bola<span className={onDark ? "text-signal" : "text-primary"}>ID</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-sidebar p-5 text-sidebar-foreground lg:flex">
        <Logo onDark />
        <p className="mt-2 text-xs text-sidebar-foreground/60">Every player has a football journey.</p>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive(to)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">Pilot</p>
          <p className="mt-1 font-display text-sm font-semibold">Makassar · Sulawesi Selatan</p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">Prototipe UI — data contoh</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/85 px-4 backdrop-blur-md lg:hidden">
          <Logo />
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-card"
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {children}
        </main>

        {/* Mobile bottom tab bar */}
        <nav
          className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 px-2 pt-1.5 backdrop-blur-md lg:hidden"
          aria-label="Navigasi utama"
        >
          <ul className="mx-auto grid max-w-md grid-cols-5">
            {nav.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10.5px] font-semibold transition-colors",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
                        active && "bg-signal",
                      )}
                    >
                      <Icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.4 : 2} />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
