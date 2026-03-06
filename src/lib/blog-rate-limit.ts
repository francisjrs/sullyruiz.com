interface RateLimitEntry {
  hourly: number[];
  daily: number[];
}

const store = new Map<string, RateLimitEntry>();

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const HOURLY_LIMIT = 5;
const DAILY_LIMIT = 10;

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { hourly: [], daily: [] };
    store.set(key, entry);
  }

  // Clean expired timestamps
  entry.hourly = entry.hourly.filter((t) => now - t < HOUR_MS);
  entry.daily = entry.daily.filter((t) => now - t < DAY_MS);

  if (entry.hourly.length >= HOURLY_LIMIT) {
    const oldest = entry.hourly[0];
    return { allowed: false, retryAfter: Math.ceil((oldest + HOUR_MS - now) / 1000) };
  }

  if (entry.daily.length >= DAILY_LIMIT) {
    const oldest = entry.daily[0];
    return { allowed: false, retryAfter: Math.ceil((oldest + DAY_MS - now) / 1000) };
  }

  entry.hourly.push(now);
  entry.daily.push(now);
  return { allowed: true };
}
