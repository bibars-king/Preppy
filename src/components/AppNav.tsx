import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOut } from "@/app/auth/actions";

// Top navigation for authenticated app pages. Shows XP + streak at a glance.
export function AppNav({
  totalXp,
  currentStreak,
}: {
  totalXp: number;
  currentStreak: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-content">
            <Logo height={30} />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/exams">Exams</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-1.5 text-sm font-semibold sm:flex">
            <span className="flex items-center gap-1.5 text-coral" title="Day streak">
              <FlameIcon /> {currentStreak}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="text-content" title="Total XP">
              {totalXp.toLocaleString()} XP
            </span>
          </div>
          <ThemeToggle />
          <form action={signOut}>
            <button className="btn-secondary !px-3 !py-2 text-xs sm:text-sm" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-2xl px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-content"
    >
      {children}
    </Link>
  );
}

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c1 3-1 4-2 6-1 2 0 4 2 4s3-2 2-4c2 1 4 4 4 7a8 8 0 1 1-16 0c0-3 2-6 4-7 0 2 1 3 2 3 1 0 2-1 1-3-1-2 0-5 3-6z" />
    </svg>
  );
}
