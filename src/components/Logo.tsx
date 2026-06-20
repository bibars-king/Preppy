import * as React from "react";

interface LogoProps {
  /** Render only the chevron tile (no wordmark) — for favicons / compact nav. */
  markOnly?: boolean;
  className?: string;
  /** Pixel height. Width scales with the viewBox. */
  height?: number;
  title?: string;
}

/**
 * "Ascent" — navy rounded-square tile with two upward coral chevrons,
 * beside the "Preppy" wordmark. Pure inline SVG so it scales crisply and
 * doubles as the favicon. The wordmark uses currentColor so it adapts to
 * light/dark; pass text color via className.
 */
export function Logo({ markOnly = false, className, height = 32, title = "Preppy" }: LogoProps) {
  const viewBox = markOnly ? "0 0 64 64" : "0 0 220 64";
  const width = markOnly ? height : (height * 220) / 64;

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="64" height="64" rx="16" fill="#16264D" />
      <path
        d="M15 36 L32 16 L49 36"
        fill="none"
        stroke="#FF6B57"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 50 L32 30 L49 50"
        fill="none"
        stroke="#FF6B57"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {!markOnly && (
        <text
          x="80"
          y="44"
          fill="currentColor"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="34"
          fontWeight="700"
        >
          Preppy
        </text>
      )}
    </svg>
  );
}
