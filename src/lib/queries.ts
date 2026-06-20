import { createClient } from "@/lib/supabase/server";
import type { Exam, Topic, Question, Quiz, Profile, Attempt } from "./types";

// Server-side data access. Each function uses the request-scoped Supabase
// client, so RLS guarantees users only ever read their own profile/attempts.

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return (data as Profile) ?? null;
}

export async function getExams(): Promise<Exam[]> {
  const supabase = createClient();
  const { data } = await supabase.from("exams").select("*").order("type");
  return (data as Exam[]) ?? [];
}

export async function getExamBySlug(slug: string): Promise<Exam | null> {
  const supabase = createClient();
  const { data } = await supabase.from("exams").select("*").eq("slug", slug).maybeSingle();
  return (data as Exam) ?? null;
}

export async function getTopics(examId: string): Promise<Topic[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("topics")
    .select("*")
    .eq("exam_id", examId)
    .order("order_index");
  return (data as Topic[]) ?? [];
}

export async function getTopic(topicId: string): Promise<Topic | null> {
  const supabase = createClient();
  const { data } = await supabase.from("topics").select("*").eq("id", topicId).maybeSingle();
  return (data as Topic) ?? null;
}

export async function getQuizzesForExam(examId: string): Promise<Quiz[]> {
  const supabase = createClient();
  const { data } = await supabase.from("quizzes").select("*").eq("exam_id", examId);
  return (data as Quiz[]) ?? [];
}

export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  const supabase = createClient();
  const { data } = await supabase.from("quizzes").select("*").eq("slug", slug).maybeSingle();
  return (data as Quiz) ?? null;
}

export async function getQuiz(id: string): Promise<Quiz | null> {
  const supabase = createClient();
  const { data } = await supabase.from("quizzes").select("*").eq("id", id).maybeSingle();
  return (data as Quiz) ?? null;
}

export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase.from("questions").select("*").in("id", ids);
  const rows = (data as Question[]) ?? [];
  // Preserve the order specified by the quiz's question_ids list.
  const byId = new Map(rows.map((q) => [q.id, q]));
  return ids.map((id) => byId.get(id)).filter((q): q is Question => Boolean(q));
}

export async function getRecentAttempts(profileId: string, limit = 5): Promise<Attempt[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("attempts")
    .select("*")
    .eq("profile_id", profileId)
    .not("finished_at", "is", null)
    .order("finished_at", { ascending: false })
    .limit(limit);
  return (data as Attempt[]) ?? [];
}

export async function getAttempt(id: string): Promise<Attempt | null> {
  const supabase = createClient();
  const { data } = await supabase.from("attempts").select("*").eq("id", id).maybeSingle();
  return (data as Attempt) ?? null;
}

export async function getAllFinishedAttempts(profileId: string): Promise<Attempt[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("attempts")
    .select("*")
    .eq("profile_id", profileId)
    .not("finished_at", "is", null)
    .order("finished_at", { ascending: false });
  return (data as Attempt[]) ?? [];
}

/** Map of exam_id -> number of gradable (mcq/grid_in) questions. */
export async function getGradableCountByExam(): Promise<Map<string, number>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("questions")
    .select("exam_id, type")
    .neq("type", "frq");
  const counts = new Map<string, number>();
  for (const row of (data as { exam_id: string }[]) ?? []) {
    counts.set(row.exam_id, (counts.get(row.exam_id) ?? 0) + 1);
  }
  return counts;
}

/**
 * Mastery per exam: how many distinct questions the user has answered
 * correctly, out of the exam's gradable total. Pure aggregation over the
 * user's own attempts (RLS already scopes the rows).
 */
export function computeExamProgress(
  attempts: Attempt[],
  totalsByExam: Map<string, number>,
): Map<string, { correct: number; total: number; pct: number }> {
  const correctByExam = new Map<string, Set<string>>();
  for (const a of attempts) {
    const set = correctByExam.get(a.exam_id) ?? new Set<string>();
    for (const r of a.raw_score_data?.results ?? []) {
      if (r.correct === true) set.add(r.question_id);
    }
    correctByExam.set(a.exam_id, set);
  }

  const out = new Map<string, { correct: number; total: number; pct: number }>();
  for (const [examId, total] of totalsByExam) {
    const correct = correctByExam.get(examId)?.size ?? 0;
    out.set(examId, {
      correct,
      total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    });
  }
  return out;
}
