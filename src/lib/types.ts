// Shared domain types for Preppy. These mirror the Postgres schema and the
// typed content seed files so the same shapes flow from /content -> DB -> UI.

export type ExamType = "psat" | "ap";
export type QuestionType = "mcq" | "grid_in" | "frq";
export type Difficulty = "easy" | "medium" | "hard";
export type QuizMode = "practice" | "warmup" | "mock";

export interface Choice {
  /** Letter key shown to the student, e.g. "A". */
  key: string;
  /** Markdown body of the choice. */
  text: string;
}

export interface Exam {
  id: string;
  slug: string;
  name: string;
  type: ExamType;
  /** Short marketing blurb used on cards / exam home. */
  description?: string;
}

export interface Topic {
  id: string;
  exam_id: string;
  name: string;
  order_index: number;
  youtube_video_id: string | null;
  /** Optional one-line summary of the lesson. */
  summary?: string;
}

export interface Question {
  id: string;
  topic_id: string;
  exam_id: string;
  type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  choices: Choice[] | null;
  /** Letter for mcq, numeric/string for grid_in, null for frq. */
  correct_answer: string | null;
  explanation: string | null;
  model_answer: string | null;
  order_index: number;
}

export interface Quiz {
  id: string;
  slug: string;
  exam_id: string;
  title: string;
  mode: QuizMode;
  time_limit_seconds: number | null;
  question_ids: string[];
}

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

/** Per-question record stored inside attempts.raw_score_data. */
export interface QuestionResult {
  question_id: string;
  chosen_answer: string | null;
  correct: boolean | null; // null for ungraded FRQ
  skipped: boolean;
  flagged: boolean;
}

export interface Attempt {
  id: string;
  profile_id: string;
  quiz_id: string | null;
  exam_id: string;
  mode: QuizMode;
  started_at: string;
  finished_at: string | null;
  score: number;
  total: number;
  raw_score_data: { results: QuestionResult[] };
}

// ---- Content seed shapes (what /content/*.ts export) ----
// Content uses human-friendly string keys; the seed script resolves
// foreign keys and inserts rows.

export interface SeedQuestion {
  key: string;
  type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  choices?: Choice[];
  correct_answer?: string | null;
  explanation?: string;
  model_answer?: string;
}

export interface SeedTopic {
  key: string;
  name: string;
  youtube_video_id: string | null;
  summary?: string;
  questions: SeedQuestion[];
}

export interface SeedQuiz {
  key: string;
  title: string;
  mode: QuizMode;
  time_limit_seconds: number | null;
  /** Question keys, in order. */
  question_keys: string[];
}

export interface SeedExam {
  slug: string;
  name: string;
  type: ExamType;
  description: string;
  topics: SeedTopic[];
  quizzes: SeedQuiz[];
}
