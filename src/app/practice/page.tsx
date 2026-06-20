import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Quiz } from "@/components/Quiz";

export const metadata = { title: "Practice · AP Calculus AB" };

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-content">
            <Logo height={30} />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">
            AP Calculus AB
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-content">Practice set</h1>
          <p className="mt-2 text-muted">
            Pick an answer to see instant feedback and an explanation.
          </p>
        </div>

        <Quiz />
      </main>
    </div>
  );
}
