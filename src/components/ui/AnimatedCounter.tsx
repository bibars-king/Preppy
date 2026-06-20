"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

// Counts up to `value` when scrolled into view. Used for XP, streaks, scores.
export function AnimatedCounter({
  value,
  duration = 1.1,
  className,
  suffix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = Math.round(latest).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
