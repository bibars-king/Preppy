import type { Question } from "./types";

/** XP awarded per correct answer, scaled lightly by difficulty. */
export const XP_BY_DIFFICULTY = {
  easy: 10,
  medium: 15,
  hard: 25,
} as const;

/**
 * Normalize a grid-in answer so equivalent forms compare equal:
 * "0.5" === "1/2" === ".5", "3/1" === "3", trailing zeros ignored.
 * Returns a canonical numeric string, or the trimmed lowercase original
 * if it isn't numeric (lets us still compare string answers).
 */
export function normalizeGridIn(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === "") return "";

  // Fraction a/b
  const fraction = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (fraction) {
    const num = parseFloat(fraction[1]);
    const den = parseFloat(fraction[2]);
    if (den !== 0) return canonicalNumber(num / den);
  }

  // Plain number (handles leading-dot decimals, percentages stripped)
  const cleaned = trimmed.replace(/[%$,\s]/g, "");
  const asNum = Number(cleaned);
  if (!Number.isNaN(asNum) && cleaned !== "") return canonicalNumber(asNum);

  return trimmed.toLowerCase();
}

function canonicalNumber(n: number): string {
  // Round to 4 significant decimals to absorb float noise, then trim zeros.
  const rounded = Number(n.toFixed(6));
  return String(rounded);
}

/**
 * Grade a single question. FRQ always returns null (ungraded / self-scored).
 * Returns true/false for mcq + grid_in.
 */
export function gradeAnswer(
  question: Pick<Question, "type" | "correct_answer">,
  chosen: string | null,
): boolean | null {
  if (question.type === "frq") return null;
  if (chosen == null || chosen.trim() === "") return false;
  if (question.correct_answer == null) return false;

  if (question.type === "mcq") {
    return chosen.trim().toUpperCase() === question.correct_answer.trim().toUpperCase();
  }
  // grid_in
  return normalizeGridIn(chosen) === normalizeGridIn(question.correct_answer);
}

export function xpForQuestion(difficulty: keyof typeof XP_BY_DIFFICULTY): number {
  return XP_BY_DIFFICULTY[difficulty] ?? 10;
}
