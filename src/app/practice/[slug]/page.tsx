import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQuizBySlug, getQuestionsByIds, getExams } from "@/lib/queries";
import { PracticeRunner } from "@/components/practice/PracticeRunner";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const quiz = await getQuizBySlug(params.slug);
  return { title: quiz?.title ?? "Practice" };
}

export default async function PracticePage({ params }: { params: { slug: string } }) {
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
    <PracticeRunner
      quizId={quiz.id}
      examId={quiz.exam_id}
      examSlug={exam?.slug ?? ""}
      mode={quiz.mode === "mock" ? "practice" : quiz.mode}
      title={quiz.title}
      questions={questions}
    />
  );
}
