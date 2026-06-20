import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries";
import { AppNav } from "@/components/AppNav";

// Shared shell for authenticated pages (dashboard, exams, results).
// Practice and mock-test routes intentionally live outside this shell so they
// can present their own focused chrome.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.id);

  return (
    <div className="min-h-screen bg-background">
      <AppNav totalXp={profile?.total_xp ?? 0} currentStreak={profile?.current_streak ?? 0} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
