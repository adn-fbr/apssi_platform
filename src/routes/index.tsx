import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, ShieldCheck, Sparkles, SquareStack } from "lucide-react";
import hero from "@/assets/hero-grassroots.jpg";
import { buttonVariants } from "@/components/kit-variants";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/roles-context";
import { roles } from "@/lib/roles-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BolaID — Every Player Has a Football Journey" },
      {
        name: "description",
        content:
          "Infrastruktur digital sepak bola usia dini Indonesia: Football ID, passport pemain, dashboard orang tua, SSB, dan turnamen.",
      },
      { property: "og:title", content: "BolaID — Every Player Has a Football Journey" },
      {
        property: "og:description",
        content: "Satu identitas. Satu perjalanan. Satu ekosistem sepak bola usia dini.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/** Home role cards come from the same role list as the nav, so all roles stay in sync. */
const roleCards = roles.map((r) => ({
  to: r.tabs[0]!.to,
  icon: r.icon,
  title: r.label,
  desc: r.desc,
  tag: r.product,
}));

const journey = ["SSB", "U9", "Turnamen", "Seleksi", "Akademi"];

export function Index() {
  const { role } = useRole();
  const primaryTab = role.tabs[0]!;
  const secondaryActions = role.tabs.slice(1, 4);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative -mx-4 -mt-5 overflow-hidden sm:mx-0 sm:mt-0 sm:rounded-3xl">
        <img
          src={hero}
          alt="Anak-anak bermain sepak bola di lapangan saat matahari terbenam"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
        />
        <div className="bg-hero-fade absolute inset-0" />
        <div className="relative flex min-h-[420px] flex-col justify-end p-5 text-pitch-foreground sm:min-h-[440px] sm:p-10">
          <p className="w-fit rounded-full bg-signal px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-signal-foreground animate-rise">
            Workspace · {role.product}
          </p>
          <h1 className="mt-4 max-w-2xl text-[40px] font-extrabold leading-[0.95] animate-rise sm:text-5xl lg:text-6xl">
            {role.label} workspace
          </h1>
          <p className="mt-4 max-w-xl text-base text-pitch-foreground/85 animate-rise sm:text-lg">
            {role.desc} Use this dashboard to move directly into the current role context and adjust
            the workspace when needed.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 animate-rise sm:flex-row">
            <Link
              to={primaryTab.to}
              className={cn(buttonVariants({ variant: "signal", size: "lg" }))}
            >
              Open {primaryTab.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/account"
              className={cn(buttonVariants({ variant: "chalkOutline", size: "lg" }))}
            >
              Switch workspace
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Active role
          </p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{role.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{role.person}</p>
            </div>
            <div className="rounded-2xl bg-signal px-3 py-2 text-sm font-bold text-signal-foreground">
              {role.initials}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-secondary p-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Focus</p>
              <p className="mt-1 font-bold">{role.product}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Primary
              </p>
              <p className="mt-1 font-bold">{primaryTab.label}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Mode</p>
              <p className="mt-1 font-bold">Prototype</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Quick actions
          </p>
          <div className="mt-3 space-y-2.5">
            <Link
              to={primaryTab.to}
              className="flex items-center justify-between rounded-2xl border border-primary/20 bg-secondary px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-primary" />
                Open {primaryTab.label}
              </span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
            <Link
              to="/account"
              className="flex items-center justify-between rounded-2xl border bg-card px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <SquareStack className="h-4 w-4 text-muted-foreground" />
                Switch workspace
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            {secondaryActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center justify-between rounded-2xl border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  {action.label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Workspace overview
          </p>
          <h2 className="mt-2 text-xl font-bold">What this role area is for</h2>
          <ul className="mt-4 space-y-3">
            {role.tabs.map((tab) => (
              <li key={tab.to} className="rounded-2xl border bg-secondary/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <tab.icon className="h-4 w-4 text-primary" />
                    {tab.label}
                  </span>
                  <Link to={tab.to} className="text-xs font-semibold text-primary">
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-card">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            First use
          </p>
          <h2 className="mt-2 text-xl font-bold">No live operational data yet</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            This workspace is ready for role-specific records and activity once the product data
            model is connected. Until then, the best next step is to open the role dashboard or
            switch to another role from the available list.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to={primaryTab.to}
              className={cn(buttonVariants({ variant: "signal", size: "sm" }))}
            >
              View {primaryTab.label}
            </Link>
            <Link to="/account" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Demo role settings
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Demo peran
            </p>
            <h2 className="text-2xl font-bold">Satu ekosistem, banyak peran</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilihan peran hanya mengubah tampilan prototipe, bukan akses atau izin akun.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {roleCards.map(({ to, icon: Icon, title, desc, tag }) => (
            <Link
              key={to}
              to={to}
              className="group flex min-h-[176px] flex-col rounded-2xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-signal group-hover:text-signal-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {tag}
              </p>
              <h3 className="mt-0.5 text-lg font-bold">{title}</h3>
              <p className="mb-3 mt-1 text-[13px] leading-snug text-muted-foreground">{desc}</p>
              <ArrowRight className="mt-auto h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="pitch-stripes overflow-hidden rounded-3xl p-5 text-pitch-foreground sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pitch-muted">
            The player owns the journey
          </p>
          <h2 className="mt-2 max-w-md text-2xl font-bold sm:text-3xl">
            Pindah SSB? Riwayatnya tetap utuh.
          </h2>
          <p className="mt-2 max-w-md text-sm text-pitch-foreground/75">
            SSB hanya punya hubungan keanggotaan — bukan kepemilikan. Data pemain ikut ke mana pun
            ia bermain.
          </p>
          <ol className="no-scrollbar mt-6 flex items-center gap-1.5 overflow-x-auto pb-1">
            {journey.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold",
                    i === journey.length - 1
                      ? "bg-signal text-signal-foreground"
                      : "bg-pitch-foreground/10",
                  )}
                >
                  {s}
                </span>
                {i < journey.length - 1 && <span className="h-px w-4 bg-pitch-foreground/40" />}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="rounded-3xl border bg-card p-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Active track
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold tabular">{role.tabs.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">role views connected</p>
          </div>
          <div className="rounded-3xl border bg-card p-5 shadow-card">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <p className="mt-2 font-display text-base font-bold leading-tight">
              Shared role navigation stays prototype-only.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Frontend role selection is for workspace flow, not server-side authorization.
            </p>
          </div>
        </div>
      </section>

      <p className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" /> One Identity. One Journey. One Football Ecosystem.
      </p>
    </div>
  );
}
