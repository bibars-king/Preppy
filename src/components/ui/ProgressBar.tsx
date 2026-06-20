"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  pct,
  className,
}: {
  pct: number;
  className?: string;
}) {
  return (
    <div className={"h-2 overflow-hidden rounded-full bg-border " + (className ?? "")}>
      <motion.div
        className="h-full rounded-full bg-coral"
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}
