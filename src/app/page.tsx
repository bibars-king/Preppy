import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicNav } from "@/components/landing/PublicNav";
import { Landing } from "@/components/landing/Landing";

export default async function HomePage() {
  // Signed-in users skip the marketing page.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <Landing />
    </div>
  );
}
