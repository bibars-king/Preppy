import type { SeedExam } from "@/lib/types";
import { psat } from "./psat";
import { calcAB } from "./calc-ab";

// The full content catalog. Adding a new exam later is purely additive:
// create /content/<exam>.ts exporting a SeedExam, then append it here and
// re-run `npm run seed`. No component or feature work required.
export const exams: SeedExam[] = [psat, calcAB];
