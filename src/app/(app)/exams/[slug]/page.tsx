import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamBySlug, getTopics, getQuizzesForExam } from "@/lib/queries";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const exam = await getExamBySlug(params.slug);
  return { title: exam?.name ?? "Exam" };
}

export default async function ExamHomePage({ params }: { params: { slug: string } }) {
  const exam = await getExamBySlug(params.slug);
  if (!exam) notFound();

  const [topics, quizzes] = await Promise.all([
    getTopics(exam.id),
    getQuizzesForExam(exam.id),
  ]);

  const mock = quizzes.find((q) => q.mode === "mock");

  return (
    <div className="space-y-10">
      <div>
        <Link href="/exams" className="text-sm font-semibold text-muted hover:text-content">
          ← All exams
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-coral">
              {exam.type === "psat" ? "Digital PSAT" : "Advanced Placement"}
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-content">{exam.name}</h1>
            <p className="mt-2 max-w-2xl text-muted">{exam.description}</p>
          </div>
          {mock && (
            <Link href={`/mock/${mock.slug}`} className="btn-navy">
              Start full mock test
            </Link>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-content">Topics</h2>
        <div className="space-y-4">
          {topics.map((topic, i) => (
            <Link
              key={topic.id}
              href={`/exams/${exam.slug}/topics/${topic.id}`}
              className="card group flex items-center gap-5 p-5 transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-content">{topic.name}</h3>
                {topic.summary && (
                  <p className="mt-0.5 truncate text-sm text-muted">{topic.summary}</p>
                )}
              </div>
              <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
                {topic.youtube_video_id && <span className="text-coral">▶ Lesson</span>}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          ))}

          {topics.length === 0 && (
            <div className="card p-6 text-sm text-muted">No topics yet for this exam.</div>
          )}
        </div>
      </div>

      {/* Test modes */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-content">Tests &amp; warm-ups</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes
            .slice()
            .sort((a, b) => modeRank(a.mode) - modeRank(b.mode))
            .map((quiz) => {
              const isMock = quiz.mode === "mock";
              return (
                <Link
                  key={quiz.id}
                  href={`${isMock ? "/mock" : "/practice"}/${quiz.slug}`}
                  className="card flex flex-col justify-between gap-4 p-5 transition-shadow hover:shadow-md"
                >
                  <div>
                    <span
                      className={
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                        modeStyle(quiz.mode)
                      }
                    >
                      {modeLabel(quiz.mode)}
                    </span>
                    <h3 className="mt-3 font-semibold text-content">{quiz.title}</h3>
                  </div>
                  <p className="text-sm text-muted">
                    {quiz.question_ids.length} questions
                    {quiz.time_limit_seconds
                      ? ` · ${Math.round(quiz.time_limit_seconds / 60)} min`
                      : " · untimed"}
                  </p>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function modeRank(m: string) {
  return m === "warmup" ? 0 : m === "practice" ? 1 : 2;
}
function modeLabel(m: string) {
  return m === "warmup" ? "Warm-up" : m === "practice" ? "Practice" : "Mock test";
}
function modeStyle(m: string) {
  if (m === "mock") return "bg-navy/10 text-navy dark:bg-coral/10 dark:text-coral";
  if (m === "warmup") return "bg-coral/10 text-coral";
  return "bg-success/10 text-success";
}
