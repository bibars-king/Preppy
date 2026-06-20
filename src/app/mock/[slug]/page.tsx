import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQuizBySlug, getQuestionsByIds, getExams } from "@/lib/queries";
import { MockRunner } from "@/components/mock/MockRunner";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const quiz = await getQuizBySlug(params.slug);
  return { title: quiz?.title ?? "Mock test" };
}

export default async function MockPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const quiz = await getQuizBySlug(params.slug);
  if (!quiz) notFound();

  const [questions, exams] = await Promise.all([
    getQuestionsByIds(quiz.question_ids),
    getExams(),
  ]);
  const exam = exams.find((e) => e.id === quiz.exam_id);

  return (
    <MockRunner
      quizId={quiz.id}
      examId={quiz.exam_id}
      examName={exam?.name ?? "Mock test"}
      examSlug={exam?.slug ?? ""}
      title={quiz.title}
      timeLimitSeconds={quiz.time_limit_seconds ?? 1800}
      questions={questions}
    />
  );
}
