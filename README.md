# Preppy

A free, no-frills test-prep app. **No login, no database** — everything runs
locally with hardcoded content.

- **Animated landing page** (navy `#16264D` + coral `#FF6B57`, rounded cards,
  bold rounded font, a hero with a "Start practicing" button)
- **AP Calculus AB practice** — 8 multiple-choice questions shown one at a
  time, with instant right/wrong feedback, an explanation after each, a small
  confetti pop on correct answers, and a final score
- **Light / dark mode** toggle

Built with Next.js 14, Tailwind CSS, and Framer Motion.

## Run it in your browser

You need [Node.js](https://nodejs.org) 18.18+ installed. Then, from this
folder:

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser. That's it — no accounts, no
keys, no setup.

Click **Start practicing** to take the AP Calculus AB quiz.

## Edit the questions

All questions live in [`src/lib/questions.ts`](./src/lib/questions.ts). Edit
that file to change prompts, choices, the correct answer, or explanations —
the quiz updates automatically.

## Project structure

```
src/
  app/
    layout.tsx         Root layout, fonts, no-flash theme script
    page.tsx           Animated landing page
    practice/page.tsx  Practice page (renders the quiz)
    globals.css        Tailwind + design tokens (light/dark via CSS variables)
  components/
    Quiz.tsx           The interactive quiz
    Logo.tsx           Inline SVG logo
    ThemeToggle.tsx    Light/dark toggle
    ui/Confetti.tsx    Correct-answer confetti burst
    ui/AnimatedCounter.tsx  Count-up number for the score
  lib/
    questions.ts       The 8 hardcoded AP Calculus AB questions
```
