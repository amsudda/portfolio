const intFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function formatInt(n: number): string {
  return Number.isFinite(n) ? intFmt.format(n) : "—";
}

export function formatFixed(n: number, digits: number): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export const fmt = {
  roas: (n: number) => `${formatFixed(n, 2)}x`,
  lkr: (n: number, digits = 2) => `LKR ${digits === 0 ? formatInt(n) : formatFixed(n, digits)}`,
  pct: (n: number, digits = 1) => `${formatFixed(n, digits)}%`,
};

/** "12 SEP 2026" — the mono date style used across the admin. */
export function formatMonoDate(d: Date): string {
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Colombo" })
    .toUpperCase();
}

export function formatDateTime(d: Date): string {
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Parses user-entered numbers like "4,180,000" or "1 240". Empty → null. */
export function parseLooseNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[,\s]/g, "").replace(/^LKR/i, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
