import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Exchanges the email-confirmation code for a session, then lands the user
// on the dashboard. Configured as the Supabase email redirect target.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not sign you in`);
}
