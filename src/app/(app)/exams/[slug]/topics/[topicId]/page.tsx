import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getExamBySlug,
  getTopic,
  getQuizzesForExam,
  getQuestionsByIds,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { YouTubePlayer } from "@/components/YouTubePlayer";

export async function generateMetadata({ params }: { params: { topicId: string } }) {
  const topic = await getTopic(params.topicId);
  return { title: topic?.name ?? "Topic" };
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string; topicId: string };
}) {
  const [exam, topic] = await Promise.all([
    getExamBySlug(params.slug),
    getTopic(params.topicId),
  ]);
  if (!exam || !topic) notFound();

  // Which question ids belong to this topic — used to surface the matching
  // practice set(s).
  const supabase = createClient();
  const { data: topicQuestionRows } = await supabase
    .from("questions")
    .select("id")
    .eq("topic_id", topic.id);
  const topicQuestionIds = new Set((topicQuestionRows ?? []).map((r) => r.id as string));

  const allQuizzes = await getQuizzesForExam(exam.id);
  const topicPractice = allQuizzes.filter(
    (q) =>
      q.mode === "practice" &&
      q.question_ids.some((id) => topicQuestionIds.has(id)),
  );
  const warmup = allQuizzes.find((q) => q.mode === "warmup");
  const mock = allQuizzes.find((q) => q.mode === "mock");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/exams/${exam.slug}`}
          className="text-sm font-semibold text-muted hover:text-content"
        >
          ← {exam.name}
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-content">{topic.name}</h1>
        {topic.summary && <p className="mt-2 max-w-2xl text-muted">{topic.summary}</p>}
      </div>

      {/* Lesson */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Lesson</h2>
        <YouTubePlayer videoId={topic.youtube_video_id ?? ""} title={topic.name} />
      </section>

      {/* Practice options */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-content">Practice</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicPractice.map((quiz) => (
            <EntryCard
              key={quiz.id}
              href={`/practice/${quiz.slug}`}
              badge="Practice"
              badgeClass="bg-success/10 text-success"
              title={quiz.title}
              meta={`${quiz.question_ids.length} questions · instant feedback`}
            />
          ))}

          {warmup && (
            <EntryCard
              href={`/practice/${warmup.slug}`}
              badge="Warm-up"
              badgeClass="bg-coral/10 text-coral"
              title={warmup.title}
              meta={`${warmup.question_ids.length} questions · builds your streak`}
            />
          )}

          {mock && (
            <EntryCard
              href={`/mock/${mock.slug}`}
              badge="Mock test"
              badgeClass="bg-navy/10 text-navy dark:bg-coral/10 dark:text-coral"
              title={mock.title}
              meta={`${mock.question_ids.length} questions · timed · scored`}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function EntryCard({
  href,
  badge,
  badgeClass,
  title,
  meta,
}: {
  href: string;
  badge: string;
  badgeClass: string;
  title: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="card flex flex-col justify-between gap-4 p-5 transition-shadow hover:shadow-md"
    >
      <div>
        <span className={"inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold " + badgeClass}>
          {badge}
        </span>
        <h3 className="mt-3 font-semibold text-content">{title}</h3>
      </div>
      <p className="text-sm text-muted">{meta}</p>
    </Link>
  );
}
