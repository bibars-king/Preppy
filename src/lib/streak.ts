// Streak math, kept pure so it's easy to reason about and test.

/** YYYY-MM-DD in the user's local time. */
export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

export interface StreakState {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

/**
 * Apply a day of activity. Same-day repeat is a no-op. A consecutive day
 * increments; a gap resets to 1. Returns the next streak state.
 */
export function applyActivity(state: StreakState, today = todayISO()): StreakState {
  const { last_active_date, current_streak, longest_streak } = state;

  if (last_active_date === today) return state; // already counted today

  let nextCurrent: number;
  if (last_active_date && daysBetween(last_active_date, today) === 1) {
    nextCurrent = current_streak + 1;
  } else {
    nextCurrent = 1;
  }

  return {
    current_streak: nextCurrent,
    longest_streak: Math.max(longest_streak, nextCurrent),
    last_active_date: today,
  };
}

/** Level + ring progress derived from total XP. Each level is 250 XP. */
export const XP_PER_LEVEL = 250;

export function levelFromXp(totalXp: number) {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const intoLevel = totalXp % XP_PER_LEVEL;
  const progress = intoLevel / XP_PER_LEVEL; // 0..1
  return { level, intoLevel, toNext: XP_PER_LEVEL - intoLevel, progress };
}
