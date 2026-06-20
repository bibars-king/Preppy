"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const FEATURES = [
  {
    icon: "▶",
    title: "Learn by doing",
    body: "Work through real AP-style problems one at a time, with instant feedback on every answer.",
  },
  {
    icon: "◎",
    title: "Understand every step",
    body: "A clear, worked explanation appears after each question — so a wrong answer becomes a lesson.",
  },
  {
    icon: "★",
    title: "Stay motivated",
    body: "Track your score as you go, celebrate correct answers, and finish with a quick performance recap.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo height={30} className="text-content" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/practice" className="btn-primary !py-2 text-sm">
              Start practicing
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <BackdropGlow />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-24">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted"
            >
              <span className="h-2 w-2 rounded-full bg-coral" />
              AP Calculus AB · free practice
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-content sm:text-5xl lg:text-6xl"
            >
              Climb toward your
              <span className="text-coral"> best score.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-md text-lg text-muted">
              Preppy makes test prep feel effortless — sharp questions, instant feedback, and
              explanations that actually click. No sign-up required.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/practice" className="btn-primary text-base !px-7 !py-3">
                Start practicing →
              </Link>
              <a href="#how" className="btn-secondary text-base !px-7 !py-3">
                How it works
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-4 text-sm text-muted">
              8 questions · about 5 minutes · runs entirely in your browser
            </motion.p>
          </motion.div>

          <HeroCard />
        </div>
      </section>

      {/* Features */}
      <section id="how" className="bg-surface/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-coral">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-content sm:text-4xl">
              Practice that pushes you forward
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 grid gap-5 md:grid-cols-3"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-xl text-white">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-content">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="card relative overflow-hidden bg-navy px-6 py-14 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-coral/30 blur-3xl" />
          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            Ready to test yourself?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-white/70">
            Jump into 8 AP Calculus AB questions. See how you do — it takes about five minutes.
          </p>
          <Link
            href="/practice"
            className="btn relative mt-8 bg-coral text-base text-white hover:bg-[#ff5740] !px-8 !py-3"
          >
            Start practicing
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted">
        Preppy — free AP Calculus AB practice.
      </footer>
    </div>
  );
}

function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative mx-auto w-full max-w-md"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="card overflow-hidden p-6 shadow-xl shadow-navy/5"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          AP Calculus AB · Question 2
        </p>
        <p className="mt-3 text-lg font-semibold text-content">
          If f(x) = 3x² − 5x + 2, what is f′(2)?
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {["5", "7", "9", "12"].map((c, i) => (
            <div
              key={c}
              className={
                "rounded-xl border-2 px-3 py-2.5 text-sm font-medium " +
                (i === 1
                  ? "border-success bg-success/10 text-success"
                  : "border-border text-content")
              }
            >
              {String.fromCharCode(65 + i)}. {c}
            </div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 rounded-xl bg-success/10 px-3 py-2 text-sm font-semibold text-success"
        >
          Correct! f′(x) = 6x − 5, so f′(2) = 7.
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BackdropGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
      <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-navy/10 blur-3xl dark:bg-coral/10" />
    </div>
  );
}
