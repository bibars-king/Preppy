"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/lib/types";
import { gradeAnswer, xpForQuestion } from "@/lib/grading";
import { submitAttempt, type SubmittedAnswer } from "@/app/attempts/actions";
import { Markdown } from "@/components/Markdown";
import { Logo } from "@/components/Logo";
import { Confetti } from "@/components/ui/Confetti";

type Phase = "answering" | "revealed";

export function PracticeRunner({
  quizId,
  examId,
  examSlug,
  mode,
  title,
  questions,
}: {
  quizId: string;
  examId: string;
  examSlug: string;
  mode: "practice" | "warmup";
  title: string;
  questions: Question[];
}) {
  const router = useRouter();
  const startedAt = useMemo(() => new Date().toISOString(), []);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [confetti, setConfetti] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | {
    score: number;
    total: number;
    xpEarned: number;
    newStreak: number;
    attemptId: string;
  }>(null);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const phase: Phase = revealed[q?.id] ? "revealed" : "answering";
  const chosen = answers[q?.id] ?? null;
  const isCorrect = q ? gradeAnswer(q, chosen) : null;

  if (questions.length === 0) {
    return (
      <EmptyState examSlug={examSlug} message="This set has no questions yet." />
    );
  }

  function setAnswer(value: string) {
    if (revealed[q.id]) return;
    setAnswers((a) => ({ ...a, [q.id]: value }));
  }

  function reveal() {
    setRevealed((r) => ({ ...r, [q.id]: true }));
    if (q.type !== "frq" && gradeAnswer(q, answers[q.id] ?? null) === true) {
      setConfetti(false);
      // Restart the animation reliably.
      requestAnimationFrame(() => setConfetti(true));
      setTimeout(() => setConfetti(false), 1000);
    }
  }

  function toggleFlag() {
    setFlags((f) => ({ ...f, [q.id]: !f[q.id] }));
  }

  async function finish() {
    setSubmitting(true);
    const payload: SubmittedAnswer[] = questions.map((question) => ({
      question_id: question.id,
      chosen_answer: answers[question.id] ?? null,
      flagged: Boolean(flags[question.id]),
    }));
    try {
      const result = await submitAttempt({
        quizId,
        examId,
        mode,
        startedAt,
        answers: payload,
      });
      setDone(result);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <CompletionScreen
        title={title}
        examSlug={examSlug}
        result={done}
      />
    );
  }

  const answeredCount = questions.filter((qq) => revealed[qq.id]).length;

  return (
    <div className="min-h-screen bg-surface/40">
      {/* Slim header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href={`/exams/${examSlug}`} className="text-content">
            <Logo height={24} markOnly />
          </Link>
          <span className="text-sm font-semibold text-content">{title}</span>
          <span className="text-sm text-muted">
            {index + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1 w-full bg-border">
          <motion.div
            className="h-full bg-coral"
            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 py-8">
        <Confetti fire={confetti} />

        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <DifficultyDot difficulty={q.difficulty} />
            {q.type === "frq" ? "Free response" : q.type === "grid_in" ? "Grid-in" : "Multiple choice"}
            {" · "}
            {q.difficulty}
          </span>
          <button
            onClick={toggleFlag}
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors " +
              (flags[q.id]
                ? "border-warning bg-warning/10 text-warning"
                : "border-border text-muted hover:text-content")
            }
          >
            <FlagIcon filled={Boolean(flags[q.id])} /> {flags[q.id] ? "Flagged" : "Flag"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="card p-6">
              <Markdown className="text-lg text-content">{q.prompt}</Markdown>

              {/* Answer area */}
              <div className="mt-6">
                {q.type === "mcq" && q.choices && (
                  <ChoiceList
                    choices={q.choices}
                    chosen={chosen}
                    correct={q.correct_answer}
                    revealed={phase === "revealed"}
                    onPick={setAnswer}
                  />
                )}

                {q.type === "grid_in" && (
                  <GridInput
                    value={chosen ?? ""}
                    revealed={phase === "revealed"}
                    correctValue={q.correct_answer ?? ""}
                    isCorrect={isCorrect}
                    onChange={setAnswer}
                  />
                )}

                {q.type === "frq" && (
                  <FrqArea
                    value={chosen ?? ""}
                    revealed={phase === "revealed"}
                    onChange={setAnswer}
                  />
                )}
              </div>
            </div>

            {/* Feedback */}
            {phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                {q.type !== "frq" ? (
                  <FeedbackBanner correct={isCorrect === true} xp={xpForQuestion(q.difficulty)} />
                ) : (
                  <div className="rounded-2xl border border-coral/30 bg-coral/5 px-4 py-2.5 text-sm font-semibold text-content">
                    Self-scored — compare your response with the model answer below.
                  </div>
                )}

                {q.type === "frq" && q.model_answer && (
                  <div className="card mt-4 p-6">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-coral">
                      Model answer
                    </h3>
                    <Markdown className="text-content">{q.model_answer}</Markdown>
                  </div>
                )}

                {q.type !== "frq" && q.explanation && (
                  <div className="card mt-4 p-6">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                      Explanation
                    </h3>
                    <Markdown className="text-content">{q.explanation}</Markdown>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="btn-secondary"
          >
            Back
          </button>

          {phase === "answering" ? (
            <button
              onClick={reveal}
              disabled={q.type !== "frq" && (chosen == null || chosen.trim() === "")}
              className="btn-primary"
            >
              {q.type === "frq" ? "Reveal model answer" : "Check answer"}
            </button>
          ) : isLast ? (
            <button onClick={finish} disabled={submitting} className="btn-primary">
              {submitting ? "Saving…" : "Finish set"}
            </button>
          ) : (
            <button onClick={() => setIndex((i) => i + 1)} className="btn-primary">
              Next question
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function ChoiceList({
  choices,
  chosen,
  correct,
  revealed,
  onPick,
}: {
  choices: { key: string; text: string }[];
  chosen: string | null;
  correct: string | null;
  revealed: boolean;
  onPick: (key: string) => void;
}) {
  return (
    <div className="space-y-3">
      {choices.map((c) => {
        const selected = chosen === c.key;
        const isAnswer = correct === c.key;
        let style = "border-border hover:border-content/40";
        if (revealed) {
          if (isAnswer) style = "border-success bg-success/10";
          else if (selected) style = "border-danger bg-danger/10";
          else style = "border-border opacity-60";
        } else if (selected) {
          style = "border-coral bg-coral/5";
        }
        return (
          <motion.button
            key={c.key}
            type="button"
            whileTap={{ scale: revealed ? 1 : 0.99 }}
            onClick={() => onPick(c.key)}
            disabled={revealed}
            className={"flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors " + style}
          >
            <span
              className={
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold " +
                (selected || (revealed && isAnswer)
                  ? "border-transparent bg-navy text-white"
                  : "border-border text-muted")
              }
            >
              {c.key}
            </span>
            <span className="pt-0.5 text-content">
              <Markdown>{c.text}</Markdown>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function GridInput({
  value,
  revealed,
  correctValue,
  isCorrect,
  onChange,
}: {
  value: string;
  revealed: boolean;
  correctValue: string;
  isCorrect: boolean | null;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={revealed}
        inputMode="text"
        placeholder="Type your answer"
        className={
          "input max-w-xs text-lg " +
          (revealed ? (isCorrect ? "border-success" : "border-danger") : "")
        }
      />
      {revealed && !isCorrect && (
        <p className="mt-2 text-sm text-muted">
          Correct answer: <span className="font-semibold text-success">{correctValue}</span>
        </p>
      )}
    </div>
  );
}

function FrqArea({
  value,
  revealed,
  onChange,
}: {
  value: string;
  revealed: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted">
        Write your full response. This is <strong className="text-content">not graded</strong> —
        you&apos;ll compare it to a model answer.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={revealed}
        rows={7}
        placeholder="Show your work…"
        className="input resize-y font-[inherit]"
      />
    </div>
  );
}

function FeedbackBanner({ correct, xp }: { correct: boolean; xp: number }) {
  return (
    <div
      className={
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold " +
        (correct
          ? "border-success/30 bg-success/10 text-success"
          : "border-danger/30 bg-danger/10 text-danger")
      }
    >
      <span>{correct ? "Correct! Nice work." : "Not quite — review the explanation."}</span>
      {correct && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 16 }}
          className="rounded-full bg-success px-2.5 py-0.5 text-xs text-white"
        >
          +{xp} XP
        </motion.span>
      )}
    </div>
  );
}

function CompletionScreen({
  title,
  examSlug,
  result,
}: {
  title: string;
  examSlug: string;
  result: { score: number; total: number; xpEarned: number; newStreak: number; attemptId: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface/40 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="card w-full max-w-md p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-3xl">
          🎉
        </div>
        <h1 className="text-2xl font-bold text-content">Set complete</h1>
        <p className="mt-1 text-muted">{title}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Score" value={`${result.score}/${result.total}`} />
          <Stat label="XP earned" value={`+${result.xpEarned}`} accent />
          <Stat label="Streak" value={`${result.newStreak} 🔥`} />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link href={`/results/${result.attemptId}`} className="btn-navy w-full">
            Review answers
          </Link>
          <Link href={`/exams/${examSlug}`} className="btn-secondary w-full">
            Back to exam
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={"mt-1 text-lg font-bold " + (accent ? "text-coral" : "text-content")}>{value}</p>
    </div>
  );
}

function EmptyState({ examSlug, message }: { examSlug: string; message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card p-8 text-center">
        <p className="text-muted">{message}</p>
        <Link href={`/exams/${examSlug}`} className="btn-secondary mt-4">
          Back to exam
        </Link>
      </div>
    </div>
  );
}

function DifficultyDot({ difficulty }: { difficulty: string }) {
  const color =
    difficulty === "hard" ? "bg-danger" : difficulty === "medium" ? "bg-warning" : "bg-success";
  return <span className={"inline-block h-2 w-2 rounded-full " + color} />;
}

function FlagIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V4M4 4h13l-2 4 2 4H4" />
    </svg>
  );
}
