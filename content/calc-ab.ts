import type { SeedExam } from "@/lib/types";

// AP Calculus AB — MVP seed content.
// Two template topics: Limits & continuity (MCQ) and Derivatives (MCQ + a
// sample FRQ with a model answer for self-comparison).

export const calcAB: SeedExam = {
  slug: "ap-calculus-ab",
  name: "AP Calculus AB",
  type: "ap",
  description:
    "Master limits, derivatives, and the big ideas of single-variable calculus with worked explanations and AP-style free-response practice.",
  topics: [
    {
      key: "calc-limits",
      name: "Limits & continuity",
      youtube_video_id: "riXcZT2ICjA",
      summary:
        "Evaluate limits algebraically and graphically, handle indeterminate forms, and test continuity — the foundation everything else rests on.",
      questions: [
        {
          key: "calc-lim-1",
          type: "mcq",
          difficulty: "easy",
          prompt: "$\\lim\\limits_{x \\to 3} (2x + 1) = ?$",
          choices: [
            { key: "A", text: "5" },
            { key: "B", text: "6" },
            { key: "C", text: "7" },
            { key: "D", text: "The limit does not exist" },
          ],
          correct_answer: "C",
          explanation:
            "The function is continuous, so substitute directly: $2(3) + 1 = 7$.",
        },
        {
          key: "calc-lim-2",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "$\\lim\\limits_{x \\to 2} \\dfrac{x^2 - 4}{x - 2} = ?$",
          choices: [
            { key: "A", text: "0" },
            { key: "B", text: "2" },
            { key: "C", text: "4" },
            { key: "D", text: "The limit does not exist" },
          ],
          correct_answer: "C",
          explanation:
            "Factor: $\\frac{(x-2)(x+2)}{x-2} = x + 2$ for $x \\neq 2$. As $x \\to 2$, this approaches $2 + 2 = 4$.",
        },
        {
          key: "calc-lim-3",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "$\\lim\\limits_{x \\to \\infty} \\dfrac{3x^2 + 5}{6x^2 - x} = ?$",
          choices: [
            { key: "A", text: "0" },
            { key: "B", text: "$\\tfrac{1}{2}$" },
            { key: "C", text: "3" },
            { key: "D", text: "$\\infty$" },
          ],
          correct_answer: "B",
          explanation:
            "For a rational function with equal degrees, the limit at infinity is the ratio of leading coefficients: $\\frac{3}{6} = \\frac{1}{2}$.",
        },
        {
          key: "calc-lim-4",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "$\\lim\\limits_{x \\to 0} \\dfrac{\\sin(5x)}{x} = ?$",
          choices: [
            { key: "A", text: "0" },
            { key: "B", text: "1" },
            { key: "C", text: "5" },
            { key: "D", text: "The limit does not exist" },
          ],
          correct_answer: "C",
          explanation:
            "Using $\\lim_{u \\to 0}\\frac{\\sin u}{u} = 1$: $\\frac{\\sin(5x)}{x} = 5 \\cdot \\frac{\\sin(5x)}{5x} \\to 5 \\cdot 1 = 5$.",
        },
        {
          key: "calc-lim-5",
          type: "mcq",
          difficulty: "easy",
          prompt:
            "A function $f$ is continuous at $x = a$ if which condition holds?",
          choices: [
            { key: "A", text: "$f(a)$ is defined" },
            { key: "B", text: "$\\lim_{x \\to a} f(x)$ exists" },
            { key: "C", text: "$\\lim_{x \\to a} f(x) = f(a)$" },
            { key: "D", text: "$f$ is differentiable at $a$" },
          ],
          correct_answer: "C",
          explanation:
            "Continuity at $a$ requires all three: $f(a)$ defined, the limit exists, and they are equal. Choice C states the full condition $\\lim_{x\\to a} f(x) = f(a)$.",
        },
        {
          key: "calc-lim-6",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "The function $f(x) = \\begin{cases} x + 1 & x < 2 \\\\ kx & x \\geq 2 \\end{cases}$ is continuous at $x = 2$. What is $k$?",
          choices: [
            { key: "A", text: "$\\tfrac{1}{2}$" },
            { key: "B", text: "1" },
            { key: "C", text: "$\\tfrac{3}{2}$" },
            { key: "D", text: "3" },
          ],
          correct_answer: "C",
          explanation:
            "For continuity, the pieces must agree at $x = 2$: $2 + 1 = k(2)$, so $3 = 2k$ and $k = \\tfrac{3}{2}$.",
        },
        {
          key: "calc-lim-7",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "$\\lim\\limits_{x \\to 0^+} \\dfrac{1}{x} = ?$",
          choices: [
            { key: "A", text: "0" },
            { key: "B", text: "$-\\infty$" },
            { key: "C", text: "$+\\infty$" },
            { key: "D", text: "1" },
          ],
          correct_answer: "C",
          explanation:
            "As $x$ approaches 0 from the right (small positive values), $\\frac{1}{x}$ grows without bound: $+\\infty$.",
        },
        {
          key: "calc-lim-8",
          type: "mcq",
          difficulty: "easy",
          prompt: "$\\lim\\limits_{x \\to 4} \\sqrt{x + 5} = ?$",
          choices: [
            { key: "A", text: "3" },
            { key: "B", text: "4" },
            { key: "C", text: "5" },
            { key: "D", text: "9" },
          ],
          correct_answer: "A",
          explanation:
            "The function is continuous at $x = 4$: $\\sqrt{4 + 5} = \\sqrt{9} = 3$.",
        },
        {
          key: "calc-lim-9",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "If $\\lim_{x \\to 1} f(x) = 4$ and $\\lim_{x \\to 1} g(x) = 2$, then $\\lim_{x \\to 1} \\dfrac{f(x)}{g(x)} = ?$",
          choices: [
            { key: "A", text: "2" },
            { key: "B", text: "4" },
            { key: "C", text: "6" },
            { key: "D", text: "8" },
          ],
          correct_answer: "A",
          explanation:
            "The limit of a quotient is the quotient of the limits (denominator $\\neq 0$): $\\frac{4}{2} = 2$.",
        },
        {
          key: "calc-lim-10",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "$\\lim\\limits_{x \\to 0} \\dfrac{1 - \\cos x}{x} = ?$",
          choices: [
            { key: "A", text: "0" },
            { key: "B", text: "$\\tfrac{1}{2}$" },
            { key: "C", text: "1" },
            { key: "D", text: "The limit does not exist" },
          ],
          correct_answer: "A",
          explanation:
            "$\\lim_{x \\to 0}\\frac{1 - \\cos x}{x} = 0$ (a standard limit). Intuitively, $1 - \\cos x$ shrinks like $x^2/2$, far faster than $x$.",
        },
      ],
    },
    {
      key: "calc-derivatives",
      name: "Derivatives",
      youtube_video_id: "9vKqVkMQHKk",
      summary:
        "Apply the power, product, quotient, and chain rules, and read derivatives as instantaneous rates of change.",
      questions: [
        {
          key: "calc-der-1",
          type: "mcq",
          difficulty: "easy",
          prompt: "If $f(x) = x^4$, then $f'(x) = ?$",
          choices: [
            { key: "A", text: "$4x^3$" },
            { key: "B", text: "$x^3$" },
            { key: "C", text: "$4x^4$" },
            { key: "D", text: "$\\tfrac{1}{5}x^5$" },
          ],
          correct_answer: "A",
          explanation: "Power rule: $\\frac{d}{dx}x^n = nx^{n-1}$, so $f'(x) = 4x^3$.",
        },
        {
          key: "calc-der-2",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "If $f(x) = 3x^2 - 5x + 2$, what is $f'(2)$?",
          choices: [
            { key: "A", text: "5" },
            { key: "B", text: "7" },
            { key: "C", text: "9" },
            { key: "D", text: "12" },
          ],
          correct_answer: "B",
          explanation:
            "$f'(x) = 6x - 5$. Then $f'(2) = 6(2) - 5 = 12 - 5 = 7$.",
        },
        {
          key: "calc-der-3",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "Using the chain rule, the derivative of $f(x) = (2x + 1)^3$ is:",
          choices: [
            { key: "A", text: "$3(2x+1)^2$" },
            { key: "B", text: "$6(2x+1)^2$" },
            { key: "C", text: "$2(2x+1)^3$" },
            { key: "D", text: "$6(2x+1)^3$" },
          ],
          correct_answer: "B",
          explanation:
            "Chain rule: $3(2x+1)^2 \\cdot \\frac{d}{dx}(2x+1) = 3(2x+1)^2 \\cdot 2 = 6(2x+1)^2$.",
        },
        {
          key: "calc-der-4",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "If $f(x) = x^2 e^x$, then $f'(x) = ?$",
          choices: [
            { key: "A", text: "$2x e^x$" },
            { key: "B", text: "$x^2 e^x$" },
            { key: "C", text: "$(2x + x^2)e^x$" },
            { key: "D", text: "$2x e^{x}$" },
          ],
          correct_answer: "C",
          explanation:
            "Product rule: $f'(x) = 2x \\cdot e^x + x^2 \\cdot e^x = (2x + x^2)e^x$.",
        },
        {
          key: "calc-der-5",
          type: "mcq",
          difficulty: "easy",
          prompt:
            "The derivative $f'(a)$ represents which of the following?",
          choices: [
            { key: "A", text: "The area under $f$ at $x = a$" },
            { key: "B", text: "The slope of the tangent line to $f$ at $x = a$" },
            { key: "C", text: "The maximum value of $f$" },
            { key: "D", text: "The value of $f$ at $x = a$" },
          ],
          correct_answer: "B",
          explanation:
            "By definition, $f'(a)$ is the instantaneous rate of change — the slope of the tangent line to the graph at $x = a$.",
        },
        {
          key: "calc-der-6",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "What is the derivative of $f(x) = \\sin x + \\cos x$?",
          choices: [
            { key: "A", text: "$\\cos x - \\sin x$" },
            { key: "B", text: "$\\cos x + \\sin x$" },
            { key: "C", text: "$-\\cos x - \\sin x$" },
            { key: "D", text: "$\\sin x - \\cos x$" },
          ],
          correct_answer: "A",
          explanation:
            "$\\frac{d}{dx}\\sin x = \\cos x$ and $\\frac{d}{dx}\\cos x = -\\sin x$. Sum: $\\cos x - \\sin x$.",
        },
        {
          key: "calc-der-7",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "Find the slope of the tangent line to $y = \\dfrac{x}{x+1}$ at $x = 1$.",
          choices: [
            { key: "A", text: "$\\tfrac{1}{4}$" },
            { key: "B", text: "$\\tfrac{1}{2}$" },
            { key: "C", text: "1" },
            { key: "D", text: "2" },
          ],
          correct_answer: "A",
          explanation:
            "Quotient rule: $y' = \\frac{(x+1)(1) - x(1)}{(x+1)^2} = \\frac{1}{(x+1)^2}$. At $x = 1$: $\\frac{1}{4}$.",
        },
        {
          key: "calc-der-8",
          type: "mcq",
          difficulty: "easy",
          prompt: "The derivative of a constant $f(x) = 7$ is:",
          choices: [
            { key: "A", text: "7" },
            { key: "B", text: "1" },
            { key: "C", text: "0" },
            { key: "D", text: "$7x$" },
          ],
          correct_answer: "C",
          explanation: "A constant has no rate of change, so its derivative is 0.",
        },
        {
          key: "calc-der-9",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "At what $x$-value does $f(x) = x^2 - 6x + 8$ have a horizontal tangent?",
          choices: [
            { key: "A", text: "$x = 2$" },
            { key: "B", text: "$x = 3$" },
            { key: "C", text: "$x = 4$" },
            { key: "D", text: "$x = 6$" },
          ],
          correct_answer: "B",
          explanation:
            "A horizontal tangent occurs where $f'(x) = 0$. $f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$.",
        },
        {
          key: "calc-der-10",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "If $f(x) = \\ln(x^2 + 1)$, then $f'(x) = ?$",
          choices: [
            { key: "A", text: "$\\dfrac{1}{x^2 + 1}$" },
            { key: "B", text: "$\\dfrac{2x}{x^2 + 1}$" },
            { key: "C", text: "$\\dfrac{2x}{x^2}$" },
            { key: "D", text: "$2x \\ln(x^2 + 1)$" },
          ],
          correct_answer: "B",
          explanation:
            "Chain rule: $\\frac{d}{dx}\\ln(u) = \\frac{u'}{u}$ with $u = x^2 + 1$, $u' = 2x$. So $f'(x) = \\frac{2x}{x^2+1}$.",
        },
        {
          key: "calc-der-frq-1",
          type: "frq",
          difficulty: "hard",
          prompt:
            "A particle moves along a line so that its position at time $t \\geq 0$ seconds is $s(t) = t^3 - 6t^2 + 9t$ meters.\n\n**(a)** Find the velocity $v(t)$ and the acceleration $a(t)$.\n\n**(b)** Find all times in $[0, 4]$ when the particle is at rest.\n\n**(c)** Determine the intervals on $[0, 4]$ when the particle is moving to the right (positive direction). Justify your answer.",
          model_answer:
            "**(a)** Velocity is the derivative of position:\n\n$$v(t) = s'(t) = 3t^2 - 12t + 9$$\n\nAcceleration is the derivative of velocity:\n\n$$a(t) = v'(t) = 6t - 12$$\n\n**(b)** The particle is at rest when $v(t) = 0$:\n\n$$3t^2 - 12t + 9 = 0 \\implies 3(t^2 - 4t + 3) = 0 \\implies 3(t-1)(t-3) = 0$$\n\nSo $t = 1$ second and $t = 3$ seconds, both within $[0, 4]$.\n\n**(c)** The particle moves right where $v(t) > 0$. The sign of $3(t-1)(t-3)$:\n\n- On $[0, 1)$: both factors negative/positive → product positive, so $v > 0$.\n- On $(1, 3)$: $v < 0$ (moving left).\n- On $(3, 4]$: $v > 0$ (moving right).\n\nTherefore the particle moves to the right on $[0, 1)$ and on $(3, 4]$, because $v(t) > 0$ on those intervals.",
          explanation:
            "This is an ungraded free-response item. Compare your work against the model answer and check that you (1) differentiated correctly, (2) solved $v(t)=0$, and (3) justified direction using the sign of the velocity.",
        },
      ],
    },
  ],
  quizzes: [
    {
      key: "calc-practice-limits",
      title: "Limits & continuity — practice set",
      mode: "practice",
      time_limit_seconds: null,
      question_keys: [
        "calc-lim-1",
        "calc-lim-2",
        "calc-lim-3",
        "calc-lim-4",
        "calc-lim-5",
        "calc-lim-6",
        "calc-lim-7",
        "calc-lim-9",
      ],
    },
    {
      key: "calc-practice-derivatives",
      title: "Derivatives — practice set",
      mode: "practice",
      time_limit_seconds: null,
      question_keys: [
        "calc-der-1",
        "calc-der-2",
        "calc-der-3",
        "calc-der-4",
        "calc-der-5",
        "calc-der-6",
        "calc-der-9",
      ],
    },
    {
      key: "calc-frq",
      title: "Free response — particle motion",
      mode: "practice",
      time_limit_seconds: null,
      question_keys: ["calc-der-frq-1"],
    },
    {
      key: "calc-warmup",
      title: "Daily warm-up — mixed",
      mode: "warmup",
      time_limit_seconds: null,
      question_keys: [
        "calc-lim-1",
        "calc-der-1",
        "calc-lim-8",
        "calc-der-8",
        "calc-der-5",
      ],
    },
    {
      key: "calc-mock",
      title: "AP Calculus AB — full mock test",
      mode: "mock",
      time_limit_seconds: 1800,
      question_keys: [
        "calc-lim-1",
        "calc-lim-2",
        "calc-lim-3",
        "calc-lim-4",
        "calc-lim-6",
        "calc-lim-9",
        "calc-der-1",
        "calc-der-2",
        "calc-der-3",
        "calc-der-4",
        "calc-der-7",
        "calc-der-9",
      ],
    },
  ],
};
