import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { signUp } from "@/app/auth/actions";
import { Field } from "@/components/ui/Field";

export const metadata = { title: "Sign up" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface/50 px-4 py-12">
      <Link href="/" className="mb-8 text-content">
        <Logo height={38} />
      </Link>
      <div className="card w-full max-w-md bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-content">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start prepping in under a minute.</p>

        {searchParams.error && (
          <p className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {searchParams.error}
          </p>
        )}

        <form action={signUp} className="mt-6 space-y-4">
          <Field
            label="Display name"
            name="display_name"
            autoComplete="name"
            placeholder="Alex"
            required
          />
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
          <button type="submit" className="btn-primary w-full !py-3">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-coral hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
