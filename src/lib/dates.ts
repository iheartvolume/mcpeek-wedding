/* Date helpers with no dependencies, safe to use in browser scripts. */

export const TIME_ZONE = "America/Chicago";

/** Turn "YYYY-MM-DD" into a Date at noon UTC (avoids time-zone date shifts). */
export function dateFromYMD(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** Whole days from today (in Chicago) until a YYYY-MM-DD date. */
export function daysUntil(ymd: string, now: Date = new Date()): number {
  const todayYMD = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
  return Math.round((dateFromYMD(ymd).getTime() - dateFromYMD(todayYMD).getTime()) / 86_400_000);
}
