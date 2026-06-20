// Hardcoded AP Calculus AB practice questions. No database — edit this file
// to change the quiz.

export interface Question {
  prompt: string;
  choices: string[];
  /** Index (0–3) of the correct choice. */
  answer: number;
  explanation: string;
}

export const questions: Question[] = [
  {
    prompt: "If f(x) = x⁴, what is f′(x)?",
    choices: ["4x³", "x³", "4x⁴", "⅕x⁵"],
    answer: 0,
    explanation: "Power rule: d/dx xⁿ = n·xⁿ⁻¹, so f′(x) = 4x³.",
  },
  {
    prompt: "If f(x) = 3x² − 5x + 2, what is f′(2)?",
    choices: ["5", "7", "9", "12"],
    answer: 1,
    explanation: "f′(x) = 6x − 5, so f′(2) = 6(2) − 5 = 12 − 5 = 7.",
  },
  {
    prompt: "Evaluate the limit:  lim (x→2) (x² − 4) / (x − 2).",
    choices: ["0", "2", "4", "Does not exist"],
    answer: 2,
    explanation:
      "Factor the numerator: (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2. As x → 2 this approaches 2 + 2 = 4.",
  },
  {
    prompt: "Using the chain rule, the derivative of f(x) = (2x + 1)³ is:",
    choices: ["3(2x + 1)²", "6(2x + 1)²", "2(2x + 1)³", "6(2x + 1)³"],
    answer: 1,
    explanation:
      "Chain rule: 3(2x + 1)² · d/dx(2x + 1) = 3(2x + 1)² · 2 = 6(2x + 1)².",
  },
  {
    prompt: "Evaluate the limit at infinity:  lim (x→∞) (3x² + 5) / (6x² − x).",
    choices: ["0", "½", "3", "∞"],
    answer: 1,
    explanation:
      "When the numerator and denominator have the same degree, the limit is the ratio of leading coefficients: 3/6 = ½.",
  },
  {
    prompt: "What is the derivative of the constant function f(x) = 7?",
    choices: ["7", "1", "0", "7x"],
    answer: 2,
    explanation: "A constant never changes, so its rate of change — the derivative — is 0.",
  },
  {
    prompt: "At what x-value does f(x) = x² − 6x + 8 have a horizontal tangent line?",
    choices: ["x = 2", "x = 3", "x = 4", "x = 6"],
    answer: 1,
    explanation:
      "A horizontal tangent occurs where f′(x) = 0. Here f′(x) = 2x − 6 = 0, so x = 3.",
  },
  {
    prompt: "Evaluate the limit:  lim (x→0) sin(5x) / x.",
    choices: ["0", "1", "5", "Does not exist"],
    answer: 2,
    explanation:
      "Using lim (u→0) sin(u)/u = 1: sin(5x)/x = 5 · sin(5x)/(5x) → 5 · 1 = 5.",
  },
];
