import { describe, expect, it } from "vitest";
import { blendedSplit, computePerformance, monthlyBars, spendWeighted, splitTotal, type PerformanceInput } from "./metrics";
import { parseLooseNumber, slugify } from "./format";

const rec = (over: Partial<PerformanceInput>): PerformanceInput => ({
  spendLkr: 0,
  roas: 0,
  cpcLkr: 0,
  cvrPct: 0,
  costPerPurchaseLkr: 0,
  monthlyRoas: [],
  split: { conversions: 0, leadgen: 0, retargeting: 0, awareness: 0 },
  ...over,
});

// The four published records from the Meta Ads prototype.
const prototype: PerformanceInput[] = [
  rec({ spendLkr: 4_180_000, roas: 6.1, cpcLkr: 9.8, cvrPct: 7.2, costPerPurchaseLkr: 402, monthlyRoas: [4.1, 4.4, 5.0, 4.8, 5.6, 6.2, 6.8, 7.4], split: { conversions: 52, leadgen: 18, retargeting: 22, awareness: 8 } }),
  rec({ spendLkr: 11_640_000, roas: 3.8, cpcLkr: 16.2, cvrPct: 4.4, costPerPurchaseLkr: 1240, monthlyRoas: [2.6, 3.0, 3.3, 3.1, 3.6, 4.1, 4.4, 4.9], split: { conversions: 24, leadgen: 48, retargeting: 18, awareness: 10 } }),
  rec({ spendLkr: 2_970_000, roas: 5.4, cpcLkr: 10.6, cvrPct: 6.8, costPerPurchaseLkr: 486, monthlyRoas: [3.4, 3.8, 4.2, 4.0, 4.9, 5.4, 6.1, 6.6], split: { conversions: 44, leadgen: 26, retargeting: 20, awareness: 10 } }),
  rec({ spendLkr: 6_310_000, roas: 4.9, cpcLkr: 11.1, cvrPct: 5.9, costPerPurchaseLkr: 598, monthlyRoas: [3.2, 3.5, 4.0, 3.8, 4.4, 5.0, 5.5, 6.0], split: { conversions: 48, leadgen: 22, retargeting: 18, awareness: 12 } }),
];

describe("spendWeighted", () => {
  it("weights each metric by spend", () => {
    const rows = [rec({ spendLkr: 100, roas: 2 }), rec({ spendLkr: 300, roas: 6 })];
    expect(spendWeighted(rows, (r) => r.roas)).toBe(5);
  });

  it("returns 0 when there is no spend", () => {
    expect(spendWeighted([rec({ roas: 4 })], (r) => r.roas)).toBe(0);
    expect(spendWeighted([], (r: PerformanceInput) => r.roas)).toBe(0);
  });

  it("ignores non-finite values", () => {
    const rows = [rec({ spendLkr: 100, roas: Number.NaN }), rec({ spendLkr: 100, roas: 4 })];
    expect(spendWeighted(rows, (r) => r.roas)).toBe(2);
  });
});

describe("computePerformance", () => {
  it("matches the prototype's blended figures", () => {
    const p = computePerformance(prototype);
    expect(p.hasData).toBe(true);
    expect(p.totalSpend).toBe(25_100_000);
    // Σ(metric × spend in LKR M) / 25.1
    expect(p.roas.toFixed(2)).toBe("4.65"); // 116.687 / 25.1
    expect(p.cpc.toFixed(2)).toBe("13.19"); // 331.055 / 25.1
    expect(p.cvr.toFixed(1)).toBe("5.5"); // 138.737 / 25.1
    expect(Math.round(p.costPerPurchase)).toBe(850); // 21330.76 / 25.1
  });

  it("reports no data for an empty set", () => {
    const p = computePerformance([]);
    expect(p.hasData).toBe(false);
    expect(p.monthly).toHaveLength(8);
    expect(p.monthly.every((m) => m.value === null && m.heightPct === 6)).toBe(true);
  });
});

describe("monthlyBars", () => {
  it("averages reported months and scales to the peak", () => {
    const bars = monthlyBars([{ monthlyRoas: [2, 4] }, { monthlyRoas: [4, null] }]);
    expect(bars[0]).toEqual({ label: "JAN", value: 3, heightPct: 75 });
    expect(bars[1]).toEqual({ label: "FEB", value: 4, heightPct: 100 });
    expect(bars[2]).toEqual({ label: "MAR", value: null, heightPct: 6 });
  });

  it("never renders a bar below 6%", () => {
    const bars = monthlyBars([{ monthlyRoas: [0.1, 10] }]);
    expect(bars[0].heightPct).toBe(6);
  });
});

describe("blendedSplit", () => {
  it("always sums to exactly 100", () => {
    const split = blendedSplit(prototype);
    expect(Object.values(split).reduce((a, b) => a + b, 0)).toBe(100);
    expect(split.leadgen).toBeGreaterThan(split.awareness);
  });

  it("is all zeros without spend", () => {
    expect(blendedSplit([])).toEqual({ conversions: 0, leadgen: 0, retargeting: 0, awareness: 0 });
  });
});

describe("helpers", () => {
  it("splitTotal sums string or number inputs", () => {
    expect(splitTotal({ conversions: "52", leadgen: 18, retargeting: "22", awareness: "8" })).toBe(100);
  });

  it("parseLooseNumber handles separators and blanks", () => {
    expect(parseLooseNumber("4,180,000")).toBe(4_180_000);
    expect(parseLooseNumber("LKR 1 240")).toBe(1240);
    expect(parseLooseNumber("")).toBeNull();
    expect(parseLooseNumber("abc")).toBeNull();
  });

  it("slugify produces URL-safe slugs", () => {
    expect(slugify("Ceylon Leaf — Retail Launch")).toBe("ceylon-leaf-retail-launch");
    expect(slugify("F&B Opening")).toBe("f-and-b-opening");
  });
});
