"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/lib/questions";
import { Confetti } from "@/components/ui/Confetti";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function Quiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const isCorrect = selected === q.answer;

  function choose(i: number) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.answer) {
      setScore((s) => s + 1);
      setConfetti(false);
      requestAnimationFrame(() => setConfetti(true));
      setTimeout(() => setConfetti(false), 1000);
    }
  }

  function next() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return <Results score={score} total={questions.length} onRestart={restart} />;
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Confetti anchors to this relative container */}
      <Confetti fire={confetti} />

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-muted">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-coral"
            animate={{ width: `${((index + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-content sm:text-2xl">{q.prompt}</h2>

            <div className="mt-6 space-y-3">
              {q.choices.map((choice, i) => {
                const isAnswer = i === q.answer;
                const isPicked = selected === i;

                let style = "border-border hover:border-content/40";
                if (revealed) {
                  if (isAnswer) style = "border-success bg-success/10";
                  else if (isPicked) style = "border-danger bg-danger/10";
                  else style = "border-border opacity-60";
                }

                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={{ scale: revealed ? 1 : 0.98 }}
                    onClick={() => choose(i)}
                    disabled={revealed}
                    className={
                      "flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-content transition-colors " +
                      style
                    }
                  >
                    <span
                      className={
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold " +
                        (revealed && isAnswer
                          ? "border-transparent bg-success text-white"
                          : revealed && isPicked
                            ? "border-transparent bg-danger text-white"
                            : "border-border text-muted")
                      }
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-medium">{choice}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback + explanation */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5">
                    <div
                      className={
                        "rounded-2xl px-4 py-3 text-sm font-semibold " +
                        (isCorrect
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger")
                      }
                    >
                      {isCorrect ? "Correct! Nice work. 🎉" : "Not quite — here's why:"}
                    </div>
                    <p className="mt-3 px-1 text-content/90">{q.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={next}
              disabled={!revealed}
              className="btn-primary disabled:cursor-not-allowed"
            >
              {isLast ? "See results" : "Next question"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-semibold text-muted hover:text-content">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

function Results({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const message =
    pct >= 88 ? "Outstanding!" : pct >= 62 ? "Solid work!" : pct >= 38 ? "Keep going!" : "Good start!";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="card mx-auto w-full max-w-md p-8 text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 text-3xl">
        🏆
      </div>
      <h2 className="text-2xl font-bold text-content">{message}</h2>
      <p className="mt-1 text-muted">AP Calculus AB · practice complete</p>

      <div className="my-8">
        <div className="text-6xl font-bold text-coral">
          <AnimatedCounter value={score} />
          <span className="text-3xl text-muted">/{total}</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-muted">{pct}% correct</p>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={onRestart} className="btn-primary w-full">
          Try again
        </button>
        <Link href="/" className="btn-secondary w-full">
          Back to home
        </Link>
      </div>
    </motion.div>
  );
}
