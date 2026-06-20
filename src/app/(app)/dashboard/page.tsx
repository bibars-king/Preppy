import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getProfile,
  getExams,
  getQuizzesForExam,
  getAllFinishedAttempts,
  getGradableCountByExam,
  computeExamProgress,
} from "@/lib/queries";
import { levelFromXp } from "@/lib/streak";
import { LevelRing } from "@/components/ui/LevelRing";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ProgressBar } from "@/components/ui/ProgressBar";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profile, exams, attempts, totals] = await Promise.all([
    getProfile(user.id),
    getExams(),
    getAllFinishedAttempts(user.id),
    getGradableCountByExam(),
  ]);

  const totalXp = profile?.total_xp ?? 0;
  const { level, intoLevel, toNext, progress } = levelFromXp(totalXp);
  const progressByExam = computeExamProgress(attempts, totals);
  const firstName = (profile?.display_name ?? "there").split(" ")[0];

  // "Continue where you left off" — most recent attempt's exam.
  const lastAttempt = attempts[0];
  const lastExam = lastAttempt
    ? exams.find((e) => e.id === lastAttempt.exam_id)
    : undefined;

  // Pick a warm-up quiz to surface.
  const warmupExam = exams[0];
  const warmupQuizzes = warmupExam ? await getQuizzesForExam(warmupExam.id) : [];
  const warmup = warmupQuizzes.find((q) => q.mode === "warmup");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-content">
          {greeting()}, {firstName}.
        </h1>
        <p className="mt-1 text-muted">
          {profile?.current_streak
            ? `You're on a ${profile.current_streak}-day streak. Keep it going.`
            : "Start a warm-up to begin your streak."}
        </p>
      </div>

      {/* Stat row */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="card flex items-center gap-5 p-6">
          <LevelRing progress={progress} level={level} size={120} />
          <div>
            <p className="text-sm font-semibold text-content">
              {toNext} XP to level {level + 1}
            </p>
            <p className="mt-1 text-sm text-muted">{intoLevel} / 250 this level</p>
          </div>
        </div>

        <StatCard
          label="Total XP"
          value={<AnimatedCounter value={totalXp} className="text-4xl font-bold text-content" />}
          sub="Earned across all practice"
        />
        <StatCard
          label="Day streak"
          value={
            <span className="flex items-center gap-2 text-4xl font-bold text-coral">
              <AnimatedCounter value={profile?.current_streak ?? 0} />
              <span className="text-2xl">🔥</span>
            </span>
          }
          sub={`Longest: ${profile?.longest_streak ?? 0} days`}
        />
      </div>

      {/* Continue + warm-up */}
      <div className="grid gap-5 md:grid-cols-2">
        {lastExam ? (
          <ActionCard
            eyebrow="Continue where you left off"
            title={lastExam.name}
            body={`Last attempt scored ${lastAttempt.score}/${lastAttempt.total}.`}
            href={`/exams/${lastExam.slug}`}
            cta="Keep going"
          />
        ) : (
          <ActionCard
            eyebrow="Get started"
            title="Pick your first exam"
            body="Browse topics, watch a lesson, and run a practice set."
            href="/exams"
            cta="Browse exams"
          />
        )}

        {warmup && warmupExam && (
          <ActionCard
            eyebrow="Daily warm-up"
            title={warmup.title}
            body="A short, mixed set to keep your streak alive and your skills sharp."
            href={`/practice/${warmup.slug}`}
            cta="Start warm-up"
            accent
          />
        )}
      </div>

      {/* Per-exam progress */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-content">Your exams</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {exams.map((exam) => {
            const p = progressByExam.get(exam.id) ?? { correct: 0, total: 0, pct: 0 };
            return (
              <Link
                key={exam.id}
                href={`/exams/${exam.slug}`}
                className="card group p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-coral">
                      {exam.type === "psat" ? "PSAT" : "AP"}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-content">{exam.name}</h3>
                  </div>
                  <span className="text-2xl font-bold text-content">{p.pct}%</span>
                </div>
                <p className="mt-3 mb-2 text-sm text-muted">
                  {p.correct} of {p.total} questions mastered
                </p>
                <ProgressBar pct={p.pct} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="card p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-2">{value}</div>
      <p className="mt-2 text-sm text-muted">{sub}</p>
    </div>
  );
}

function ActionCard({
  eyebrow,
  title,
  body,
  href,
  cta,
  accent = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "card flex flex-col justify-between p-6 " +
        (accent ? "border-coral/30 bg-coral/5" : "")
      }
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-coral">{eyebrow}</p>
        <h3 className="mt-1 text-lg font-semibold text-content">{title}</h3>
        <p className="mt-2 text-sm text-muted">{body}</p>
      </div>
      <Link href={href} className={(accent ? "btn-primary" : "btn-navy") + " mt-5 w-fit"}>
        {cta}
      </Link>
    </div>
  );
}
