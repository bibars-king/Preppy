"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#FF6B57", "#16A34A", "#F59E0B", "#16264D", "#FF9E57"];

// A short, celebratory burst for correct practice answers. Never used during
// a mock test — exams stay calm.
export function Confetti({ fire }: { fire: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        y: -(Math.random() * 240 + 80),
        rotate: Math.random() * 540,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.08,
        size: Math.random() * 6 + 6,
      })),
    // Re-randomize each time it fires.
    [fire],
  );

  return (
    <AnimatePresence>
      {fire && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 h-0 w-0">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              className="confetti-piece rounded-[2px]"
              style={{ backgroundColor: p.color, width: p.size, height: p.size }}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate }}
              transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
