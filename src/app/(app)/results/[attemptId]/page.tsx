import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAttempt, getQuestionsByIds, getExams, getTopics } from "@/lib/queries";
import { Markdown } from "@/components/Markdown";
import { ResultsHeader } from "@/components/results/ResultsHeader";
import type { QuestionResult } from "@/lib/types";

export const metadata = { title: "Results" };

export default async function ResultsPage({ params }: { params: { attemptId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const attempt = await getAttempt(params.attemptId);
  if (!attempt) notFound();

  const results = attempt.raw_score_data?.results ?? [];
  const [questions, exams] = await Promise.all([
    getQuestionsByIds(results.map((r) => r.question_id)),
    getExams(),
  ]);
  const exam = exams.find((e) => e.id === attempt.exam_id);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const topics = exam ? await getTopics(exam.id) : [];
  const topicNameById = new Map(topics.map((t) => [t.id, t.name]));

  const pct = attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0;
  const durationMin = attempt.finished_at
    ? Math.max(
        1,
        Math.round(
          (new Date(attempt.finished_at).getTime() - new Date(attempt.started_at).getTime()) /
            60000,
        ),
      )
    : null;

  const incorrect = results.filter((r) => r.correct === false);
  const skipped = results.filter((r) => r.skipped);
  const studyTopics = nextStudyTopics(incorrect, byId, topicNameById);

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/exams/${exam?.slug ?? ""}`} className="text-sm font-semibold text-muted hover:text-content">
          ← {exam?.name ?? "Exam"}
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-content">
          {attempt.mode === "mock" ? "Mock test results" : "Results"}
        </h1>
      </div>

      <ResultsHeader
        score={attempt.score}
        total={attempt.total}
        pct={pct}
        durationMin={durationMin}
        flagged={results.filter((r) => r.flagged).length}
      />

      {/* What to study next */}
      {studyTopics.length > 0 && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-coral">
            What to study next
          </h2>
          <p className="mt-2 text-muted">
            You missed questions in these areas. Revisit the lessons, then try the practice set
            again.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {studyTopics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-surface px-3 py-1 text-sm font-semibold text-content"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Per-question review */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-content">
          Review · {results.length} questions
          {skipped.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted">({skipped.length} skipped)</span>
          )}
        </h2>

        <div className="space-y-4">
          {results.map((r, i) => {
            const q = byId.get(r.question_id);
            if (!q) return null;
            return (
              <div key={r.question_id} className="card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-surface/50 px-5 py-3">
                  <span className="text-sm font-semibold text-content">
                    Question {i + 1}
                    {r.flagged && <span className="ml-2 text-warning">⚑ flagged</span>}
                  </span>
                  <StatusPill result={r} type={q.type} />
                </div>
                <div className="p-5">
                  <Markdown className="text-content">{q.prompt}</Markdown>

                  {q.type !== "frq" && (
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <KV
                        label="Your answer"
                        value={r.skipped ? "—" : answerLabel(q, r.chosen_answer)}
                        tone={r.correct ? "success" : "danger"}
                      />
                      <KV label="Correct answer" value={answerLabel(q, q.correct_answer)} tone="success" />
                    </div>
                  )}

                  {q.type !== "frq" && q.explanation && (
                    <div className="mt-4 rounded-2xl bg-surface p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                        Explanation
                      </p>
                      <Markdown className="text-content">{q.explanation}</Markdown>
                    </div>
                  )}

                  {q.type === "frq" && q.model_answer && (
                    <div className="mt-4 rounded-2xl bg-surface p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-coral">
                        Model answer (self-scored)
                      </p>
                      <Markdown className="text-content">{q.model_answer}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/exams/${exam?.slug ?? ""}`} className="btn-navy">
          Back to exam
        </Link>
        <Link href="/dashboard" className="btn-secondary">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ result, type }: { result: QuestionResult; type: string }) {
  if (type === "frq") {
    return <Pill className="bg-coral/10 text-coral">Self-scored</Pill>;
  }
  if (result.skipped) return <Pill className="bg-border/50 text-muted">Skipped</Pill>;
  return result.correct ? (
    <Pill className="bg-success/10 text-success">Correct</Pill>
  ) : (
    <Pill className="bg-danger/10 text-danger">Incorrect</Pill>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={"rounded-full px-2.5 py-0.5 text-xs font-semibold " + className}>{children}</span>
  );
}

function KV({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "danger";
}) {
  return (
    <div className="rounded-xl border border-border px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className={"font-semibold " + (tone === "success" ? "text-success" : "text-danger")}>{value}</p>
    </div>
  );
}

function answerLabel(
  q: { type: string; choices: { key: string; text: string }[] | null },
  answer: string | null,
): string {
  if (answer == null || answer === "") return "—";
  if (q.type === "mcq" && q.choices) {
    const c = q.choices.find((ch) => ch.key === answer);
    return c ? `${c.key}` : answer;
  }
  return answer;
}

function nextStudyTopics(
  incorrect: QuestionResult[],
  byId: Map<string, { topic_id: string }>,
  topicNameById: Map<string, string>,
): string[] {
  // Distinct topics the student missed questions in, by friendly name.
  const names = new Set<string>();
  for (const r of incorrect) {
    const q = byId.get(r.question_id);
    const name = q && topicNameById.get(q.topic_id);
    if (name) names.add(name);
  }
  return Array.from(names);
}
