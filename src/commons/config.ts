export interface ReminderConfig {
  // Scheduled meeting start, or null when none was given in /create
  startTime: Date | null;
  // Minutes between the soft reminders before the scheduled start
  reminderIntervalMinutes: number;
  // Minutes between the soft reminders after the scheduled start
  lateReminderIntervalMinutes: number;
}

const DEFAULT_REMINDER_INTERVAL_MINUTES = 5;
const DEFAULT_LATE_REMINDER_INTERVAL_MINUTES = 2;

const parseMinutes = (value: string | null, fallback: number): number => {
  const parsed = Number(value);
  return value && Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Accepted formats:
 * - ISO 8601 date-time, e.g. 2026-10-26T14:00:00-03:00 (no offset = browser local time)
 * - Unix timestamp in seconds or milliseconds
 * - HH:mm, meaning today in the browser's local time
 */
export const parseStartTime = (rawValue: string | null): Date | null => {
  if (!rawValue) return null;
  // An unencoded "+" from a time zone offset arrives as a space
  const value = rawValue.trim().replace(/ (\d{2}:?\d{2})$/, '+$1');
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    const timestamp = Number(value);
    // Values below 10^11 can only be seconds (10^11 ms is 1973)
    return new Date(timestamp < 1e11 ? timestamp * 1000 : timestamp);
  }

  const timeOnly = value.match(/^(\d{1,2})[:h](\d{2})$/);
  if (timeOnly) {
    const date = new Date();
    date.setHours(Number(timeOnly[1]), Number(timeOnly[2]), 0, 0);
    return date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const parseReminderConfig = (scriptSrc?: string): ReminderConfig => {
  let params = new URLSearchParams();
  try {
    if (scriptSrc) params = new URL(scriptSrc, window.location.href).searchParams;
  } catch {
    // Malformed URL, fall back to the defaults
  }
  return {
    startTime: parseStartTime(params.get('startTime')),
    reminderIntervalMinutes: parseMinutes(
      params.get('reminderInterval'),
      DEFAULT_REMINDER_INTERVAL_MINUTES,
    ),
    lateReminderIntervalMinutes: parseMinutes(
      params.get('lateReminderInterval'),
      DEFAULT_LATE_REMINDER_INTERVAL_MINUTES,
    ),
  };
};
