import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { Field } from "@/components/ui/Field";
import { signIn } from "@/app/auth/actions";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-content">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to keep your streak alive.</p>

      {searchParams.error && (
        <p className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {searchParams.error}
        </p>
      )}

      <form action={signIn} className="mt-6 space-y-4">
        <input type="hidden" name="redirect" value={searchParams.redirect ?? "/dashboard"} />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <button type="submit" className="btn-primary w-full !py-3">
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to Preppy?{" "}
        <Link href="/signup" className="font-semibold text-coral hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface/50 px-4 py-12">
      <Link href="/" className="mb-8 text-content">
        <Logo height={38} />
      </Link>
      <div className="card w-full max-w-md bg-background p-8 shadow-sm">{children}</div>
    </div>
  );
}
