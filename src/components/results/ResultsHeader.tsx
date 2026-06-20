"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

// Score summary with an animated ring and count-up stats.
export function ResultsHeader({
  score,
  total,
  pct,
  durationMin,
  flagged,
}: {
  score: number;
  total: number;
  pct: number;
  durationMin: number | null;
  flagged: number;
}) {
  const size = 150;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div className="card grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--border))" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={pct >= 70 ? "#16A34A" : pct >= 40 ? "#F59E0B" : "#DC2626"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute text-center">
          <span className="block text-3xl font-bold text-content">
            <AnimatedCounter value={pct} suffix="%" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Score</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Correct" value={`${score}/${total}`} />
        <Stat label="Time used" value={durationMin ? `${durationMin} min` : "—"} />
        <Stat label="Flagged" value={String(flagged)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 text-center">
      <p className="text-2xl font-bold text-content">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
