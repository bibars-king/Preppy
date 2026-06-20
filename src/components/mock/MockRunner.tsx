"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/lib/types";
import { submitAttempt, type SubmittedAnswer } from "@/app/attempts/actions";
import { Markdown } from "@/components/Markdown";
import { Logo } from "@/components/Logo";

/**
 * Full-screen, distraction-free timed exam modeled on the Digital SAT/PSAT
 * interface. Deliberately calm: motion only confirms actions (select, flag,
 * panel open). No confetti, no streak pops, no decorative animation — this is
 * the focus surface. Scoring happens only on submit/timeout, server-side.
 *
 * Section breaks are a clean extension point: this renders a single timed
 * section. To add sections, group `questions` and gate the timer per group;
 * the navigator + submit flow below are already section-agnostic.
 */
export function MockRunner({
  quizId,
  examId,
  examName,
  examSlug,
  title,
  timeLimitSeconds,
  questions,
}: {
  quizId: string;
  examId: string;
  examName: string;
  examSlug: string;
  title: string;
  timeLimitSeconds: number;
  questions: Question[];
}) {
  const router = useRouter();
  const startedAt = useMemo(() => new Date().toISOString(), []);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [showNav, setShowNav] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const q = questions[index];

  const doSubmit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
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
        mode: "mock",
        startedAt,
        answers: payload,
      });
      router.push(`/results/${result.attemptId}`);
    } catch (e) {
      console.error(e);
      submittedRef.current = false;
      setSubmitting(false);
    }
  }, [answers, flags, questions, quizId, examId, startedAt, router]);

  // Countdown. Auto-submits at zero.
  useEffect(() => {
    if (timeLeft <= 0) {
      doSubmit();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, doSubmit]);

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <p className="text-muted">This test has no questions yet.</p>
      </div>
    );
  }

  const answeredCount = questions.filter(
    (qq) => (answers[qq.id] ?? "").trim() !== "",
  ).length;
  const flaggedCount = questions.filter((qq) => flags[qq.id]).length;
  const lowTime = timeLeft <= 60;

  function pick(value: string) {
    setAnswers((a) => ({ ...a, [q.id]: value }));
  }
  function toggleFlag() {
    setFlags((f) => ({ ...f, [q.id]: !f[q.id] }));
  }

  return (
    <div className="flex h-screen flex-col bg-background text-content">
      {/* Top bar */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Logo height={22} markOnly />
          <span className="hidden text-sm font-semibold sm:inline">{examName}</span>
        </div>

        <div
          className={
            "flex items-center gap-2 rounded-2xl border px-4 py-1.5 font-mono text-lg font-semibold tabular-nums " +
            (lowTime ? "border-danger text-danger" : "border-border text-content")
          }
          aria-live="off"
        >
          <ClockIcon />
          {formatTime(timeLeft)}
        </div>

        <button onClick={() => setShowReview(true)} className="btn-navy !px-4 !py-2 text-sm">
          Submit
        </button>
      </header>

      {/* Question area */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted">
                Question {index + 1} of {questions.length}
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
                <FlagIcon filled={Boolean(flags[q.id])} />
                {flags[q.id] ? "Flagged for review" : "Flag for review"}
              </button>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <Markdown className="text-lg">{q.prompt}</Markdown>

              <div className="mt-6">
                {q.type === "mcq" && q.choices && (
                  <div className="space-y-3">
                    {q.choices.map((c) => {
                      const selected = answers[q.id] === c.key;
                      return (
                        <button
                          key={c.key}
                          onClick={() => pick(c.key)}
                          className={
                            "flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors " +
                            (selected
                              ? "border-navy bg-navy/5 dark:border-coral dark:bg-coral/5"
                              : "border-border hover:border-content/40")
                          }
                        >
                          <span
                            className={
                              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold " +
                              (selected ? "border-transparent bg-navy text-white" : "border-border text-muted")
                            }
                          >
                            {c.key}
                          </span>
                          <span className="pt-0.5">
                            <Markdown>{c.text}</Markdown>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === "grid_in" && (
                  <input
                    value={answers[q.id] ?? ""}
                    onChange={(e) => pick(e.target.value)}
                    placeholder="Type your answer"
                    className="input max-w-xs text-lg"
                  />
                )}

                {q.type === "frq" && (
                  <textarea
                    value={answers[q.id] ?? ""}
                    onChange={(e) => pick(e.target.value)}
                    rows={8}
                    placeholder="Write your response…"
                    className="input resize-y"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigator — desktop sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-l border-border p-4 lg:block">
          <Navigator
            questions={questions}
            index={index}
            answers={answers}
            flags={flags}
            onJump={(i) => setIndex(i)}
          />
        </aside>
      </main>

      {/* Bottom bar */}
      <footer className="flex h-16 flex-shrink-0 items-center justify-between border-t border-border px-4">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="btn-secondary"
        >
          Back
        </button>

        <button
          onClick={() => setShowNav(true)}
          className="rounded-2xl px-3 py-2 text-sm font-semibold text-muted hover:text-content lg:hidden"
        >
          {answeredCount}/{questions.length} answered · {flaggedCount} flagged
        </button>
        <span className="hidden text-sm text-muted lg:inline">
          {answeredCount}/{questions.length} answered · {flaggedCount} flagged
        </span>

        {index === questions.length - 1 ? (
          <button onClick={() => setShowReview(true)} className="btn-primary">
            Review &amp; submit
          </button>
        ) : (
          <button onClick={() => setIndex((i) => i + 1)} className="btn-primary">
            Next
          </button>
        )}
      </footer>

      {/* Navigator — mobile slide-over */}
      <AnimatePresence>
        {showNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNav(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-background p-5 lg:hidden"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
              <Navigator
                questions={questions}
                index={index}
                answers={answers}
                flags={flags}
                onJump={(i) => {
                  setIndex(i);
                  setShowNav(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Review / submit confirmation */}
      <AnimatePresence>
        {showReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-background p-6"
            >
              <h2 className="text-xl font-bold">Submit your test?</h2>
              <p className="mt-2 text-sm text-muted">
                You&apos;ve answered {answeredCount} of {questions.length} questions
                {flaggedCount > 0 ? ` and flagged ${flaggedCount} for review` : ""}. Once you
                submit, you&apos;ll see your score and explanations.
              </p>

              <div className="mt-4">
                <Navigator
                  questions={questions}
                  index={index}
                  answers={answers}
                  flags={flags}
                  onJump={(i) => {
                    setIndex(i);
                    setShowReview(false);
                  }}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowReview(false)} className="btn-secondary flex-1">
                  Keep working
                </button>
                <button onClick={doSubmit} disabled={submitting} className="btn-primary flex-1">
                  {submitting ? "Submitting…" : "Submit test"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navigator({
  questions,
  index,
  answers,
  flags,
  onJump,
}: {
  questions: Question[];
  index: number;
  answers: Record<string, string | null>;
  flags: Record<string, boolean>;
  onJump: (i: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Questions</h3>
      </div>
      <div className="grid grid-cols-6 gap-2 lg:grid-cols-5">
        {questions.map((qq, i) => {
          const answered = (answers[qq.id] ?? "").trim() !== "";
          const flagged = flags[qq.id];
          const current = i === index;
          return (
            <button
              key={qq.id}
              onClick={() => onJump(i)}
              className={
                "relative flex h-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors " +
                (current
                  ? "border-navy ring-2 ring-navy/30 dark:border-coral dark:ring-coral/30 "
                  : "border-border ") +
                (answered ? "bg-navy text-white dark:bg-coral" : "bg-background text-content")
              }
            >
              {i + 1}
              {flagged && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-background" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 space-y-1.5 text-xs text-muted">
        <LegendRow className="bg-navy dark:bg-coral" label="Answered" />
        <LegendRow className="border border-border bg-background" label="Not answered" />
        <LegendRow className="bg-warning" label="Flagged" />
      </div>
    </div>
  );
}

function LegendRow({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={"h-3 w-3 rounded " + className} />
      {label}
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FlagIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V4M4 4h13l-2 4 2 4H4" />
    </svg>
  );
}
