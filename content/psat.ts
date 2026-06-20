import type { SeedExam } from "@/lib/types";

// Digital PSAT — MVP seed content.
// Two template topics: one Math (with grid-ins), one Reading & Writing.
// YouTube IDs are placeholders for real lesson videos — swap in your own.

export const psat: SeedExam = {
  slug: "digital-psat",
  name: "Digital PSAT",
  type: "psat",
  description:
    "Sharpen the skills the Digital PSAT/NMSQT rewards — linear algebra, data, and evidence-based reading — with adaptive-style practice and full-length timing.",
  topics: [
    {
      key: "psat-linear",
      name: "Linear equations & systems",
      youtube_video_id: "8m4HU2_DqWg",
      summary:
        "Build, solve, and interpret linear equations and systems — the single highest-yield Math domain on the Digital PSAT.",
      questions: [
        {
          key: "psat-lin-1",
          type: "mcq",
          difficulty: "easy",
          prompt: "If $3x + 7 = 22$, what is the value of $x$?",
          choices: [
            { key: "A", text: "3" },
            { key: "B", text: "5" },
            { key: "C", text: "7" },
            { key: "D", text: "15" },
          ],
          correct_answer: "B",
          explanation:
            "Subtract 7 from both sides: $3x = 15$. Divide by 3: $x = 5$.",
        },
        {
          key: "psat-lin-2",
          type: "mcq",
          difficulty: "easy",
          prompt:
            "A line passes through the points $(0, 4)$ and $(2, 10)$. What is its slope?",
          choices: [
            { key: "A", text: "2" },
            { key: "B", text: "3" },
            { key: "C", text: "4" },
            { key: "D", text: "6" },
          ],
          correct_answer: "B",
          explanation:
            "Slope $= \\frac{10 - 4}{2 - 0} = \\frac{6}{2} = 3$.",
        },
        {
          key: "psat-lin-3",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "The equation $y = 1.5x + 12$ models the cost $y$, in dollars, of a gym membership after $x$ months. What does the number 12 represent?",
          choices: [
            { key: "A", text: "The monthly cost of the membership" },
            { key: "B", text: "The one-time sign-up fee" },
            { key: "C", text: "The total cost after one year" },
            { key: "D", text: "The number of months in the contract" },
          ],
          correct_answer: "B",
          explanation:
            "When $x = 0$ (before any months pass), $y = 12$. That fixed starting cost is the one-time sign-up fee. The 1.5 is the monthly rate.",
        },
        {
          key: "psat-lin-4",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "What is the solution $(x, y)$ to the system $\\begin{cases} 2x + y = 11 \\\\ x - y = 1 \\end{cases}$?",
          choices: [
            { key: "A", text: "(3, 5)" },
            { key: "B", text: "(4, 3)" },
            { key: "C", text: "(5, 1)" },
            { key: "D", text: "(6, -1)" },
          ],
          correct_answer: "B",
          explanation:
            "Add the equations to eliminate $y$: $3x = 12$, so $x = 4$. Then $4 - y = 1$ gives $y = 3$. Solution: $(4, 3)$.",
        },
        {
          key: "psat-lin-5",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "Line $\\ell$ has equation $y = -\\tfrac{2}{3}x + 5$. A line perpendicular to $\\ell$ has what slope?",
          choices: [
            { key: "A", text: "$-\\tfrac{3}{2}$" },
            { key: "B", text: "$-\\tfrac{2}{3}$" },
            { key: "C", text: "$\\tfrac{2}{3}$" },
            { key: "D", text: "$\\tfrac{3}{2}$" },
          ],
          correct_answer: "D",
          explanation:
            "Perpendicular slopes are negative reciprocals. The negative reciprocal of $-\\tfrac{2}{3}$ is $\\tfrac{3}{2}$.",
        },
        {
          key: "psat-lin-6",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "For what value of $c$ does the system $\\begin{cases} 4x - 2y = 10 \\\\ 6x - 3y = c \\end{cases}$ have infinitely many solutions?",
          choices: [
            { key: "A", text: "10" },
            { key: "B", text: "12" },
            { key: "C", text: "15" },
            { key: "D", text: "20" },
          ],
          correct_answer: "C",
          explanation:
            "Infinitely many solutions means the equations are multiples of each other. Multiplying the first by $\\tfrac{3}{2}$ gives $6x - 3y = 15$, so $c = 15$.",
        },
        {
          key: "psat-lin-7",
          type: "mcq",
          difficulty: "easy",
          prompt:
            "Which equation represents a line with slope 0 passing through $(2, -3)$?",
          choices: [
            { key: "A", text: "$x = 2$" },
            { key: "B", text: "$y = -3$" },
            { key: "C", text: "$y = 2x - 3$" },
            { key: "D", text: "$x = -3$" },
          ],
          correct_answer: "B",
          explanation:
            "A slope of 0 is a horizontal line, $y = k$. Since it passes through $y = -3$, the equation is $y = -3$.",
        },
        {
          key: "psat-lin-8",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "A function is defined by $f(x) = ax + b$. If $f(2) = 7$ and $f(5) = 19$, what is the value of $a$?",
          choices: [
            { key: "A", text: "3" },
            { key: "B", text: "4" },
            { key: "C", text: "5" },
            { key: "D", text: "6" },
          ],
          correct_answer: "B",
          explanation:
            "$a$ is the slope: $a = \\frac{f(5) - f(2)}{5 - 2} = \\frac{19 - 7}{3} = \\frac{12}{3} = 4$.",
        },
        {
          key: "psat-lin-9",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "The graph of $y = 2x - 6$ crosses the $x$-axis at which point?",
          choices: [
            { key: "A", text: "(0, -6)" },
            { key: "B", text: "(3, 0)" },
            { key: "C", text: "(6, 0)" },
            { key: "D", text: "(-3, 0)" },
          ],
          correct_answer: "B",
          explanation:
            "The $x$-intercept is where $y = 0$: $0 = 2x - 6 \\Rightarrow x = 3$. The point is $(3, 0)$.",
        },
        {
          key: "psat-lin-10",
          type: "mcq",
          difficulty: "easy",
          prompt: "If $\\tfrac{x}{4} - 1 = 5$, what is the value of $x$?",
          choices: [
            { key: "A", text: "16" },
            { key: "B", text: "20" },
            { key: "C", text: "24" },
            { key: "D", text: "28" },
          ],
          correct_answer: "C",
          explanation:
            "Add 1: $\\tfrac{x}{4} = 6$. Multiply by 4: $x = 24$.",
        },
        {
          key: "psat-lin-grid-1",
          type: "grid_in",
          difficulty: "medium",
          prompt:
            "If $5x - 3 = 2x + 18$, what is the value of $x$?",
          correct_answer: "7",
          explanation:
            "Subtract $2x$: $3x - 3 = 18$. Add 3: $3x = 21$. Divide by 3: $x = 7$.",
        },
        {
          key: "psat-lin-grid-2",
          type: "grid_in",
          difficulty: "medium",
          prompt:
            "A line passes through $(1, 2)$ and $(4, 8)$. What is its slope? (Enter as a decimal or fraction.)",
          correct_answer: "2",
          explanation:
            "Slope $= \\frac{8 - 2}{4 - 1} = \\frac{6}{3} = 2$.",
        },
        {
          key: "psat-lin-grid-3",
          type: "grid_in",
          difficulty: "hard",
          prompt:
            "The solution to the system $\\begin{cases} x + y = 10 \\\\ 3x - y = 2 \\end{cases}$ is $(x, y)$. What is the value of $x$?",
          correct_answer: "3",
          explanation:
            "Add the equations: $4x = 12$, so $x = 3$.",
        },
      ],
    },
    {
      key: "psat-words",
      name: "Words in context",
      youtube_video_id: "Yt1qg0u7lWw",
      summary:
        "Use sentence logic and surrounding evidence to pick the word that best fits — the most common Reading & Writing question type.",
      questions: [
        {
          key: "psat-wic-1",
          type: "mcq",
          difficulty: "easy",
          prompt:
            "While researchers once viewed the species as solitary, recent fieldwork reveals that the animals are surprisingly ______, often gathering in groups of fifty or more.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "elusive" },
            { key: "B", text: "gregarious" },
            { key: "C", text: "territorial" },
            { key: "D", text: "nocturnal" },
          ],
          correct_answer: "B",
          explanation:
            "The clue 'gathering in groups of fifty or more' signals sociability. 'Gregarious' means fond of company — a direct contrast to the earlier 'solitary.'",
        },
        {
          key: "psat-wic-2",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "The committee's report was anything but ______: every claim was backed by data, and no assertion went unexamined.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "thorough" },
            { key: "B", text: "rigorous" },
            { key: "C", text: "superficial" },
            { key: "D", text: "objective" },
          ],
          correct_answer: "C",
          explanation:
            "'Anything but ___' flips the meaning. The evidence (data-backed, fully examined) describes a careful report, so the blank needs the opposite: 'superficial.'",
        },
        {
          key: "psat-wic-3",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "Although the novel was praised for its inventive structure, critics found its dialogue ______, weighed down by stiff, unnatural exchanges.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "stilted" },
            { key: "B", text: "candid" },
            { key: "C", text: "eloquent" },
            { key: "D", text: "spontaneous" },
          ],
          correct_answer: "A",
          explanation:
            "'Stiff, unnatural exchanges' defines the blank. 'Stilted' means stiff and artificial — exactly that. The other choices imply natural or skillful speech.",
        },
        {
          key: "psat-wic-4",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "The mayor's plan, far from being a ______ response to the crisis, was the product of months of careful deliberation.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "deliberate" },
            { key: "B", text: "measured" },
            { key: "C", text: "hasty" },
            { key: "D", text: "comprehensive" },
          ],
          correct_answer: "C",
          explanation:
            "'Far from being ___' signals a contrast with 'months of careful deliberation.' The opposite of careful and slow is 'hasty.'",
        },
        {
          key: "psat-wic-5",
          type: "mcq",
          difficulty: "easy",
          prompt:
            "The instructions were so ______ that even first-time users assembled the shelf without a single mistake.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "lucid" },
            { key: "B", text: "convoluted" },
            { key: "C", text: "tedious" },
            { key: "D", text: "ambiguous" },
          ],
          correct_answer: "A",
          explanation:
            "If first-time users made no mistakes, the instructions were clear. 'Lucid' means clear and easy to understand.",
        },
        {
          key: "psat-wic-6",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "The scientist was known for her ______: she refused to accept any finding until it had been replicated many times.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "skepticism" },
            { key: "B", text: "indifference" },
            { key: "C", text: "credulity" },
            { key: "D", text: "generosity" },
          ],
          correct_answer: "A",
          explanation:
            "Refusing to accept findings without repeated proof describes a questioning, doubting stance — 'skepticism.' 'Credulity' (the opposite) means readiness to believe.",
        },
        {
          key: "psat-wic-7",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "Rather than offering a single ______ interpretation, the curator's notes invite visitors to draw their own conclusions about the painting.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "tentative" },
            { key: "B", text: "definitive" },
            { key: "C", text: "obscure" },
            { key: "D", text: "plausible" },
          ],
          correct_answer: "B",
          explanation:
            "'Rather than ___ ... invite visitors to draw their own conclusions' contrasts an open reading with a closed one. A 'definitive' interpretation is final and settled — the opposite of inviting interpretation.",
        },
        {
          key: "psat-wic-8",
          type: "mcq",
          difficulty: "medium",
          prompt:
            "The new policy was meant to ______ confusion, but its dense legal language only deepened it.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "alleviate" },
            { key: "B", text: "exacerbate" },
            { key: "C", text: "ignore" },
            { key: "D", text: "tolerate" },
          ],
          correct_answer: "A",
          explanation:
            "'But ... only deepened it' signals the policy intended the opposite of deepening confusion — to reduce it. 'Alleviate' means to lessen or ease.",
        },
        {
          key: "psat-wic-9",
          type: "mcq",
          difficulty: "easy",
          prompt:
            "Critics admired the director's ______ eye for detail, noting that no prop or shadow seemed out of place.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "careless" },
            { key: "B", text: "meticulous" },
            { key: "C", text: "fleeting" },
            { key: "D", text: "reluctant" },
          ],
          correct_answer: "B",
          explanation:
            "If nothing seemed out of place, the director was extremely careful and precise — 'meticulous.'",
        },
        {
          key: "psat-wic-10",
          type: "mcq",
          difficulty: "hard",
          prompt:
            "The essay's argument is ______: each paragraph builds logically on the last, leaving no gap for a reader to question.\n\nWhich choice completes the text with the most logical and precise word?",
          choices: [
            { key: "A", text: "disjointed" },
            { key: "B", text: "speculative" },
            { key: "C", text: "cohesive" },
            { key: "D", text: "redundant" },
          ],
          correct_answer: "C",
          explanation:
            "'Each paragraph builds logically ... no gap' describes a tightly connected whole. 'Cohesive' means unified and well-connected.",
        },
      ],
    },
  ],
  quizzes: [
    {
      key: "psat-practice-linear",
      title: "Linear equations — practice set",
      mode: "practice",
      time_limit_seconds: null,
      question_keys: [
        "psat-lin-1",
        "psat-lin-2",
        "psat-lin-3",
        "psat-lin-4",
        "psat-lin-5",
        "psat-lin-6",
        "psat-lin-grid-1",
        "psat-lin-grid-2",
        "psat-lin-grid-3",
      ],
    },
    {
      key: "psat-practice-words",
      title: "Words in context — practice set",
      mode: "practice",
      time_limit_seconds: null,
      question_keys: [
        "psat-wic-1",
        "psat-wic-2",
        "psat-wic-3",
        "psat-wic-4",
        "psat-wic-5",
        "psat-wic-6",
        "psat-wic-7",
      ],
    },
    {
      key: "psat-warmup",
      title: "Daily warm-up — mixed",
      mode: "warmup",
      time_limit_seconds: null,
      question_keys: [
        "psat-lin-1",
        "psat-wic-1",
        "psat-lin-7",
        "psat-wic-5",
        "psat-lin-grid-2",
      ],
    },
    {
      key: "psat-mock",
      title: "Digital PSAT — full mock test",
      mode: "mock",
      time_limit_seconds: 1800,
      question_keys: [
        "psat-lin-1",
        "psat-lin-3",
        "psat-lin-4",
        "psat-lin-5",
        "psat-lin-6",
        "psat-lin-8",
        "psat-lin-grid-1",
        "psat-lin-grid-3",
        "psat-wic-1",
        "psat-wic-2",
        "psat-wic-4",
        "psat-wic-7",
        "psat-wic-8",
        "psat-wic-10",
      ],
    },
  ],
};
