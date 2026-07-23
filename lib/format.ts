/** "2026-07-23" -> "Jul 23, 2026". Falls back to the raw string if it doesn't parse. */
export function formatDate(date: string): string {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
