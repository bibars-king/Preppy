/**
 * Seed Supabase with the typed content in /content.
 *
 * Usage:  npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.
 * The service-role key bypasses RLS, so this is server-only — never ship it
 * to the browser. The seed is idempotent: it upserts by slug/key so you can
 * re-run it after editing content files.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { exams } from "../content";
import type { SeedExam } from "../src/lib/types";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function seedExam(exam: SeedExam) {
  console.log(`\n→ Seeding ${exam.name} (${exam.slug})`);

  // Exam
  const { data: examRow, error: examErr } = await db
    .from("exams")
    .upsert(
      { slug: exam.slug, name: exam.name, type: exam.type, description: exam.description },
      { onConflict: "slug" },
    )
    .select()
    .single();
  if (examErr) throw examErr;
  const examId = examRow.id as string;

  // Map question keys -> generated UUIDs so quizzes can reference them.
  const questionIdByKey = new Map<string, string>();

  for (const [t, topic] of exam.topics.entries()) {
    // Topic — match on (exam_id, name) by reading then upserting.
    const { data: existingTopic } = await db
      .from("topics")
      .select("id")
      .eq("exam_id", examId)
      .eq("name", topic.name)
      .maybeSingle();

    let topicId: string;
    if (existingTopic) {
      topicId = existingTopic.id;
      await db
        .from("topics")
        .update({
          order_index: t,
          youtube_video_id: topic.youtube_video_id,
          summary: topic.summary,
        })
        .eq("id", topicId);
    } else {
      const { data: newTopic, error: topicErr } = await db
        .from("topics")
        .insert({
          exam_id: examId,
          name: topic.name,
          order_index: t,
          youtube_video_id: topic.youtube_video_id,
          summary: topic.summary,
        })
        .select()
        .single();
      if (topicErr) throw topicErr;
      topicId = newTopic.id;
    }

    console.log(`   • topic: ${topic.name} (${topic.questions.length} questions)`);

    for (const [q, question] of topic.questions.entries()) {
      // Use the content key as a stable slug stored in correct_answer? No —
      // we key questions by a deterministic external id stored in prompt hash
      // is fragile. Instead we match on (topic_id, prompt).
      const { data: existingQ } = await db
        .from("questions")
        .select("id")
        .eq("topic_id", topicId)
        .eq("prompt", question.prompt)
        .maybeSingle();

      const payload = {
        topic_id: topicId,
        exam_id: examId,
        type: question.type,
        difficulty: question.difficulty,
        prompt: question.prompt,
        choices: question.choices ?? null,
        correct_answer: question.correct_answer ?? null,
        explanation: question.explanation ?? null,
        model_answer: question.model_answer ?? null,
        order_index: q,
      };

      let questionId: string;
      if (existingQ) {
        questionId = existingQ.id;
        await db.from("questions").update(payload).eq("id", questionId);
      } else {
        const { data: newQ, error: qErr } = await db
          .from("questions")
          .insert(payload)
          .select()
          .single();
        if (qErr) throw qErr;
        questionId = newQ.id;
      }
      questionIdByKey.set(question.key, questionId);
    }
  }

  // Quizzes
  for (const quiz of exam.quizzes) {
    const questionIds = quiz.question_keys
      .map((k) => questionIdByKey.get(k))
      .filter((id): id is string => Boolean(id));

    if (questionIds.length !== quiz.question_keys.length) {
      const missing = quiz.question_keys.filter((k) => !questionIdByKey.get(k));
      console.warn(`   ! quiz "${quiz.title}" references unknown keys: ${missing.join(", ")}`);
    }

    await db.from("quizzes").upsert(
      {
        slug: quiz.key,
        exam_id: examId,
        title: quiz.title,
        mode: quiz.mode,
        time_limit_seconds: quiz.time_limit_seconds,
        question_ids: questionIds,
      },
      { onConflict: "slug" },
    );
    console.log(`   • quiz: ${quiz.title} (${questionIds.length} questions)`);
  }
}

async function main() {
  console.log("Seeding Preppy content…");
  for (const exam of exams) {
    await seedExam(exam);
  }
  console.log("\n✓ Done.");
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err);
  process.exit(1);
});
