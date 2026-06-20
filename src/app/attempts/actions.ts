"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gradeAnswer, xpForQuestion } from "@/lib/grading";
import { applyActivity } from "@/lib/streak";
import type { Question, QuestionResult, Profile } from "@/lib/types";

export interface SubmittedAnswer {
  question_id: string;
  chosen_answer: string | null;
  flagged: boolean;
}

export interface SubmitResult {
  attemptId: string;
  score: number;
  total: number;
  xpEarned: number;
  newStreak: number;
}

/**
 * Authoritative submission for every quiz mode. Grades server-side against
 * the DB (never trusting client-sent correctness), records an attempt, and
 * awards XP + advances the daily streak. FRQ items are ungraded and excluded
 * from score/total.
 */
export async function submitAttempt(args: {
  quizId: string;
  examId: string;
  mode: "practice" | "warmup" | "mock";
  startedAt: string;
  answers: SubmittedAnswer[];
}): Promise<SubmitResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const questionIds = args.answers.map((a) => a.question_id);
  const { data: questionRows } = await supabase
    .from("questions")
    .select("id, type, difficulty, correct_answer")
    .in("id", questionIds);
  const questions = (questionRows as Pick<
    Question,
    "id" | "type" | "difficulty" | "correct_answer"
  >[]) ?? [];
  const byId = new Map(questions.map((q) => [q.id, q]));

  let score = 0;
  let total = 0;
  let xpEarned = 0;
  const results: QuestionResult[] = [];

  for (const ans of args.answers) {
    const q = byId.get(ans.question_id);
    if (!q) continue;

    const skipped = ans.chosen_answer == null || ans.chosen_answer.trim() === "";
    const correct = gradeAnswer(q, ans.chosen_answer);

    if (q.type !== "frq") {
      total += 1;
      if (correct) {
        score += 1;
        xpEarned += xpForQuestion(q.difficulty);
      }
    }

    results.push({
      question_id: ans.question_id,
      chosen_answer: ans.chosen_answer,
      correct,
      skipped,
      flagged: ans.flagged,
    });
  }

  // Insert the attempt.
  const { data: attempt, error: attemptErr } = await supabase
    .from("attempts")
    .insert({
      profile_id: user.id,
      quiz_id: args.quizId,
      exam_id: args.examId,
      mode: args.mode,
      started_at: args.startedAt,
      finished_at: new Date().toISOString(),
      score,
      total,
      raw_score_data: { results },
    })
    .select("id")
    .single();
  if (attemptErr) throw attemptErr;

  // Update XP + streak on the profile.
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("total_xp, current_streak, longest_streak, last_active_date")
    .eq("id", user.id)
    .single();
  const profile = profileRow as Pick<
    Profile,
    "total_xp" | "current_streak" | "longest_streak" | "last_active_date"
  >;

  const nextStreak = applyActivity({
    current_streak: profile.current_streak,
    longest_streak: profile.longest_streak,
    last_active_date: profile.last_active_date,
  });

  await supabase
    .from("profiles")
    .update({
      total_xp: profile.total_xp + xpEarned,
      current_streak: nextStreak.current_streak,
      longest_streak: nextStreak.longest_streak,
      last_active_date: nextStreak.last_active_date,
    })
    .eq("id", user.id);

  revalidatePath("/dashboard");

  return {
    attemptId: attempt.id,
    score,
    total,
    xpEarned,
    newStreak: nextStreak.current_streak,
  };
}
