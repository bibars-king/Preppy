import Link from "next/link";
import { getExams } from "@/lib/queries";

export const metadata = { title: "Exams" };

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-content">Exams</h1>
      <p className="mt-1 text-muted">Choose an exam to see its topics, lessons, and tests.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/exams/${exam.slug}`}
            className="card group flex flex-col p-6 transition-shadow hover:shadow-md"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-coral">
              {exam.type === "psat" ? "Digital PSAT" : "Advanced Placement"}
            </span>
            <h2 className="mt-1 text-xl font-semibold text-content">{exam.name}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{exam.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-content transition-transform group-hover:translate-x-0.5">
              Open exam →
            </span>
          </Link>
        ))}

        {exams.length === 0 && (
          <div className="card p-6 text-sm text-muted">
            No exams found. Run <code className="rounded bg-border/40 px-1">npm run seed</code> to
            load content.
          </div>
        )}
      </div>
    </div>
  );
}
