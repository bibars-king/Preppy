import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-content">
          <Logo height={30} />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn-secondary !py-2 text-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary !py-2 text-sm">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
