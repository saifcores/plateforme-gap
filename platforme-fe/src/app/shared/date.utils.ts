/** Format a Date as yyyy-MM-dd using local calendar parts (avoids UTC shift). */
export function formatLocalDate(
  value: Date | string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Format date + time with local timezone offset for OffsetDateTime APIs. */
export function formatLocalDateTime(date: Date, time: string): string {
  const parts = time.split(":");
  const h = Number(parts[0] ?? 0);
  const m = Number(parts[1] ?? 0);
  const s = Number(parts[2] ?? 0);
  const d = new Date(date);
  d.setHours(h, m, s, 0);

  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, "0");
  const om = String(abs % 60).padStart(2, "0");

  const dateStr = formatLocalDate(d)!;
  const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  return `${dateStr}T${timeStr}${sign}${oh}:${om}`;
}
