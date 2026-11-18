import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { emailPasswordCredentialsSchema } from "@/lib/authentication.schema";
import {
  getAuthenticationStateFn,
  signInWithEmailPasswordFn,
} from "@/lib/authentication.functions";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk · BolaID" }] }),
  beforeLoad: async () => {
    if ((await getAuthenticationStateFn()) === "authenticated") {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const parsed = emailPasswordCredentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrorMessage("Masukkan email yang valid dan kata sandi.");
      return;
    }

    submitting.current = true;
    setPending(true);
    setErrorMessage(null);
    try {
      const result = await signInWithEmailPasswordFn({ data: parsed.data });
      if (result === "signed_in") {
        await navigate({ to: "/", replace: true });
      } else if (result === "invalid_credentials") {
        setErrorMessage("Email atau kata sandi tidak valid.");
      } else if (result === "unavailable") {
        setErrorMessage("Layanan masuk sedang tidak tersedia. Coba lagi nanti.");
      } else {
        setErrorMessage("Masukkan email yang valid dan kata sandi.");
      }
    } catch {
      setErrorMessage("Layanan masuk sedang tidak tersedia. Coba lagi nanti.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-pitch-deep px-4 py-10 text-pitch-foreground">
      <div className="bg-hero-fade absolute inset-0 opacity-80" aria-hidden="true" />
      <section className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 font-display text-2xl font-extrabold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal text-pitch-deep">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-current" />
          </span>
          <span>
            Bola<span className="text-signal">ID</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/15 bg-card p-6 text-foreground shadow-card sm:p-8">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">Akun APSI</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Masuk ke BolaID</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gunakan email dan kata sandi akun Anda.
          </p>

          <form className="mt-6 space-y-4" aria-label="Masuk" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  disabled={pending}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="login-password">
                Kata sandi
              </label>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  disabled={pending}
                  className="h-11 pl-10 pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-1 grid w-10 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={pending}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-destructive" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {pending ? "Memverifikasi…" : "Masuk"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
