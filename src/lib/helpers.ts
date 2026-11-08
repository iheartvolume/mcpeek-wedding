/* Small shared helpers: links, dates, and placeholder detection. */
import { site } from "../content/site";
import { dateFromYMD } from "./dates";

export { daysUntil } from "./dates";

/** Prefix an internal path with the site's base path (needed before the custom domain is live). */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}

/** True if a value is still a [bracketed] placeholder or empty. */
export function isPlaceholder(value: string): boolean {
  return value.trim() === "" || value.trim().startsWith("[");
}

/** "Saturday, October 30, 2027" */
export function formatLongDate(ymd: string): string {
  if (!ymd) return site.meta.tba;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateFromYMD(ymd));
}

/** "October 30, 2027" */
export function formatDate(ymd: string): string {
  if (!ymd) return site.meta.tba;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateFromYMD(ymd));
}

/** "3:00 PM" from "15:00". */
export function formatTime(hhmm: string): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "3:00 PM – 4:00 PM", or the "to be announced" text. */
export function formatTimeRange(start: string, end: string): string {
  if (!start) return site.meta.tba;
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

export const coupleNames = `${site.couple.first} ${site.couple.joiner} ${site.couple.second}`;
