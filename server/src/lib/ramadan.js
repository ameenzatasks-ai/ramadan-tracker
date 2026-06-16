// Ramadan window helpers. The spec requires that goals lock once Ramadan begins,
// and that the dashboard shows the *current day* (1..30) of Ramadan.

function parseDate(s) {
  // Treat env dates as UTC midnight so day math is stable.
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function getRamadanWindow() {
  const start = process.env.RAMADAN_START_DATE;
  const end = process.env.RAMADAN_END_DATE;
  if (!start || !end) return null;
  return { start: parseDate(start), end: parseDate(end) };
}

export function getRamadanDay(now = new Date()) {
  const win = getRamadanWindow();
  if (!win) return null;
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const startMs = win.start.getTime();
  const endMs = win.end.getTime();
  if (todayUtc < startMs || todayUtc > endMs) return null;
  const dayIndex = Math.floor((todayUtc - startMs) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(dayIndex, 1), 30);
}

export function isRamadanActive(now = new Date()) {
  return getRamadanDay(now) !== null;
}
