"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LevelRing } from "@/components/ui/LevelRing";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const EXAMS = [
  { name: "Digital PSAT", tag: "Live", live: true },
  { name: "AP Calculus AB", tag: "Live", live: true },
  { name: "AP English Language", tag: "Soon", live: false },
  { name: "AP English Literature", tag: "Soon", live: false },
  { name: "AP US History", tag: "Soon", live: false },
  { name: "AP Precalculus", tag: "Soon", live: false },
  { name: "AP Calculus BC", tag: "Soon", live: false },
  { name: "AP Biology", tag: "Soon", live: false },
];

const FEATURES = [
  {
    title: "Realistic timed mock tests",
    body: "A distraction-free, full-screen engine modeled on the Digital SAT interface — section timer, question navigator, flag for review, real scoring.",
    icon: "⏱",
  },
  {
    title: "Learn, then practice",
    body: "Every topic opens with a focused lesson video, then practice sets with instant feedback and worked explanations on every question.",
    icon: "▶",
  },
  {
    title: "Momentum that sticks",
    body: "Earn XP for every correct answer, build a daily streak, and watch your level ring fill. Motivation, minus the cartoon.",
    icon: "◎",
  },
];

export function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <BackdropGlow />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-24">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted">
                <span className="h-2 w-2 rounded-full bg-success" />
                Built for college-bound students
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-content sm:text-5xl lg:text-6xl"
            >
              Climb toward your
              <span className="text-coral"> best score.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-md text-lg text-muted">
              Preppy turns Digital PSAT and AP prep into something you actually want to
              do — sharp lessons, realistic timed exams, and progress you can feel.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary text-base !px-7 !py-3">
                Get started — it&apos;s free
              </Link>
              <Link href="/login" className="btn-secondary text-base !px-7 !py-3">
                I have an account
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-muted">
              No credit card. Two exams live today, more on the way.
            </motion.p>
          </motion.div>

          <HeroCard />
        </div>
      </section>

      {/* Exams */}
      <Section>
        <SectionHeading
          eyebrow="Exams covered"
          title="Start with the two that matter most"
          subtitle="The PSAT and AP Calculus AB are fully built. The rest of the AP lineup is rolling out on the same engine."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {EXAMS.map((e) => (
            <motion.div
              key={e.name}
              variants={fadeUp}
              className="card flex flex-col justify-between gap-4 p-5"
            >
              <span className="text-sm font-semibold text-content">{e.name}</span>
              <span
                className={
                  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                  (e.live
                    ? "bg-success/10 text-success"
                    : "bg-border/50 text-muted")
                }
              >
                {e.live && <span className="h-1.5 w-1.5 rounded-full bg-success" />}
                {e.tag}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Features */}
      <Section muted>
        <SectionHeading
          eyebrow="Why Preppy"
          title="The polish of a study app. The pull of a streak."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 grid gap-5 md:grid-cols-3"
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
      </Section>

      {/* CTA */}
      <Section>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="card relative overflow-hidden bg-navy px-6 py-14 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-coral/30 blur-3xl" />
          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            Your next score starts today.
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-white/70">
            Sign up, take a warm-up, and see where you stand. It takes about a minute.
          </p>
          <Link
            href="/signup"
            className="btn relative mt-8 bg-coral text-base text-white hover:bg-[#ff5740] !px-8 !py-3"
          >
            Create your free account
          </Link>
        </motion.div>
      </Section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted">
        <p>Preppy — prep for the Digital PSAT &amp; AP exams.</p>
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Welcome back</p>
            <p className="text-xl font-bold text-content">Today&apos;s warm-up</p>
          </div>
          <LevelRing progress={0.68} level={7} size={88} stroke={9} />
        </div>

        <div className="mt-6 space-y-3">
          <PreviewRow label="Day streak" value="12 🔥" />
          <PreviewRow label="Total XP" value="1,740" />
          <ProgressPreview />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Linear equations · Q3
          </p>
          <p className="mt-2 text-sm font-medium text-content">
            If 3x + 7 = 22, what is the value of x?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["3", "5", "7", "15"].map((c, i) => (
              <div
                key={c}
                className={
                  "rounded-xl border px-3 py-2 text-sm font-medium " +
                  (i === 1
                    ? "border-success bg-success/10 text-success"
                    : "border-border text-content")
                }
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-content">{value}</span>
    </div>
  );
}

function ProgressPreview() {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-muted">
        <span>Digital PSAT</span>
        <span>68%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-coral"
          initial={{ width: 0 }}
          animate={{ width: "68%" }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
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

function Section({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <section className={muted ? "bg-surface/60" : ""}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">{children}</div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-coral">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-content sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </motion.div>
  );
}
