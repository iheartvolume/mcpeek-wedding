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

/** Offset of Chicago time from UTC at a given instant, in ms (e.g. -5h during CDT). */
function chicagoOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - utcMs;
}

/** The instant (ms since epoch) of a Chicago wall-clock date and time. */
export function chicagoToUtc(ymd: string, hhmm: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  const [h, mi] = (hhmm || "00:00").split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const first = guess - chicagoOffsetMs(guess);
  return guess - chicagoOffsetMs(first);
}
