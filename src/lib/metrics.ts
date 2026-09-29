/**
 * Public performance figures, computed from *published* ad records only.
 * Spec: design-handoff/README.md → "Public-side computations".
 */

export const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"] as const;

export const SPLIT_KEYS = ["conversions", "leadgen", "retargeting", "awareness"] as const;
export type SplitKey = (typeof SPLIT_KEYS)[number];

export type PerformanceInput = {
  spendLkr: number;
  roas: number;
  cpcLkr: number;
  cvrPct: number;
  costPerPurchaseLkr: number;
  monthlyRoas: (number | null)[];
  split: Record<SplitKey, number>;
};

export type MonthBar = { label: string; value: number | null; heightPct: number };

export type Performance = {
  hasData: boolean;
  totalSpend: number;
  roas: number;
  cpc: number;
  cvr: number;
  costPerPurchase: number;
  monthly: MonthBar[];
  split: Record<SplitKey, number>;
};

const MIN_BAR_PCT = 6;

/** Σ(metric × spend) / Σ spend. Returns 0 when there is no spend. */
export function spendWeighted<T extends { spendLkr: number }>(rows: T[], pick: (row: T) => number): number {
  const total = rows.reduce((sum, r) => sum + safe(r.spendLkr), 0);
  if (total <= 0) return 0;
  return rows.reduce((sum, r) => sum + safe(pick(r)) * safe(r.spendLkr), 0) / total;
}

/** Mean of the reported (positive) values for each month. Bar height = value / peak, min 6%. */
export function monthlyBars(rows: Pick<PerformanceInput, "monthlyRoas">[]): MonthBar[] {
  const means = MONTH_LABELS.map((_, i) => {
    const vals = rows.map((r) => r.monthlyRoas[i]).filter((v): v is number => typeof v === "number" && v > 0);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  });
  const peak = Math.max(1, ...means.map((m) => m ?? 0));
  return MONTH_LABELS.map((label, i) => {
    const value = means[i];
    return { label, value, heightPct: Math.max(MIN_BAR_PCT, Math.round(((value ?? 0) / peak) * 100)) };
  });
}

/**
 * Spend-weighted objective split, rounded to whole percentages that sum to 100
 * (largest-remainder method) so the bars never read 99% or 101%.
 */
export function blendedSplit(rows: Pick<PerformanceInput, "spendLkr" | "split">[]): Record<SplitKey, number> {
  const raw = SPLIT_KEYS.map((k) => spendWeighted(rows, (r) => r.split[k]));
  const total = raw.reduce((a, b) => a + b, 0);
  const empty = Object.fromEntries(SPLIT_KEYS.map((k) => [k, 0])) as Record<SplitKey, number>;
  if (total <= 0) return empty;

  const scaled = raw.map((v) => (v / total) * 100);
  const floors = scaled.map(Math.floor);
  let remainder = 100 - floors.reduce((a, b) => a + b, 0);
  const order = scaled
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (remainder <= 0) break;
    floors[i] += 1;
    remainder -= 1;
  }
  return Object.fromEntries(SPLIT_KEYS.map((k, i) => [k, floors[i]])) as Record<SplitKey, number>;
}

export function computePerformance(published: PerformanceInput[]): Performance {
  const totalSpend = published.reduce((sum, r) => sum + safe(r.spendLkr), 0);
  return {
    hasData: totalSpend > 0,
    totalSpend,
    roas: spendWeighted(published, (r) => r.roas),
    cpc: spendWeighted(published, (r) => r.cpcLkr),
    cvr: spendWeighted(published, (r) => r.cvrPct),
    costPerPurchase: spendWeighted(published, (r) => r.costPerPurchaseLkr),
    monthly: monthlyBars(published),
    split: blendedSplit(published),
  };
}

export function splitTotal(split: Partial<Record<SplitKey, number | string>>): number {
  return SPLIT_KEYS.reduce((sum, k) => sum + safe(Number(split[k] ?? 0)), 0);
}

function safe(n: number): number {
  return Number.isFinite(n) ? n : 0;
}
