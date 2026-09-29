/**
 * Static copy that isn't managed in the admin.
 * Company numbers, team names and stats are SAMPLE DATA from the design handoff —
 * confirm every value with the client before launch.
 */

export const site = {
  name: "Idearigs Studios",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Social media, paid acquisition and brand production for businesses across Sri Lanka — strategy, media buying and the camera crew inside one accountable team.",
  /** Contracted production partner (confirmed by the client). */
  partnerStudio: "FRAME 025",
  /** Partner logo files (transparent PNGs cut from the client-supplied artwork). */
  partnerLogo: {
    onDark: "/partners/frame-025-light.png",
    onLight: "/partners/frame-025.png",
    width: 1316,
    height: 451,
  },
  foundedYear: 2019,
};

export const company = {
  legalName: "Idearigs (Private) Limited",
  shortLegal: "IDEARIGS (PVT) LTD",
  act: "Companies Act No. 07 of 2007",
  regNo: "PV 00298471",
  vatNo: "114982736-7000",
  email: "hello@idearigs.lk",
  phone: "+94 11 234 5678",
  phoneHref: "tel:+94112345678",
  hours: "Mon — Fri, 9.00am to 6.00pm IST",
  address: ["No. 42, Level 3, Duplication Road,", "Colombo 04, Sri Lanka"],
  locality: "Colombo",
  country: "LK",
};

export const socials = [
  { name: "Instagram", href: "https://instagram.com/" },
  { name: "Facebook", href: "https://facebook.com/" },
  { name: "LinkedIn", href: "https://linkedin.com/" },
  { name: "YouTube", href: "https://youtube.com/" },
] as const;

export type SocialName = (typeof socials)[number]["name"];

export const trustStats = [
  { value: "6 yrs", label: "SAME CORE TEAM" },
  { value: "41", label: "BRANDS MANAGED" },
  { value: "LKR 87M", label: "AD SPEND HANDLED" },
  { value: "4.8x", label: "BLENDED ROAS, 2026" },
];

export const team = [
  { name: "Dinuka Perera", role: "Strategy & Accounts", tag: "FOUNDING TEAM — 2019", photo: null },
  { name: "Nethmi Fernando", role: "Paid Media Lead", tag: "FOUNDING TEAM — 2019", photo: null },
  { name: "Ishara Weerasinghe", role: "Creative Director", tag: "FOUNDING TEAM — 2019", photo: null },
  { name: "Kavinda Weerasinghe", role: `Studio Director, ${site.partnerStudio}`, tag: "CONTRACTED PARTNER — 2026", photo: null },
] satisfies { name: string; role: string; tag: string; photo: string | null }[];

export const agreementPoints = [
  "Legally documented agreement, reviewed by counsel in Colombo",
  "Full-scale production in-house: stills, video, post and grading",
  "Fixed partner rates — no third-party vendor markup",
  "Guaranteed shoot windows within 10 working days",
];

export const studioSpec = [
  { label: "Floor", value: "1,800 sq ft" },
  { label: "Cyc wall", value: "White + black" },
  { label: "Capture", value: "6K full-frame" },
  { label: "Turnaround", value: "72 hours" },
];

/** Trend captions under the computed Performance stats. */
export const performanceDeltas = {
  roas: { text: "+0.9x YoY", direction: "up" },
  cpc: { text: "−22% vs. benchmark", direction: "down" },
  cvr: { text: "+2.4 pts", direction: "up" },
  cpp: { text: "−31% in 12 mo", direction: "down" },
} as const;

export const splitLabels = {
  conversions: "Conversions / catalogue sales",
  leadgen: "Lead generation",
  retargeting: "Retargeting",
  awareness: "Awareness / reach",
} as const;

export const portfolioStats = [
  { value: "41", label: "BRANDS SERVED" },
  { value: "19", label: "ACTIVE AD ACCOUNTS" },
  { value: "2,400+", label: "ASSETS PRODUCED" },
  { value: "6", label: "SECTORS COVERED" },
];

export const enquiryServices = [
  "Social media management",
  "Meta & Google advertising",
  "Studio production",
  "Full retainer",
] as const;

export const enquiryBudgets = [
  "Under LKR 150,000",
  "LKR 150,000 — 400,000",
  "LKR 400,000 — 1,000,000",
  "Above LKR 1,000,000",
  "Not decided yet",
] as const;

/** Taxonomies shared by the admin forms. */
export const projectSectors = ["FMCG", "Property", "Hospitality", "Retail", "Services"] as const;
export const clientSectors = [
  "FMCG",
  "Property",
  "Hospitality",
  "F&B",
  "Retail",
  "Services",
  "Healthcare",
  "Tourism",
  "Education",
  "E-commerce",
] as const;
export const projectServices = ["Social media", "Meta ads", "Photography", "Video"] as const;
export const clipCategories = ["Tabletop", "Brand film", "Property", "Hospitality", "Social cut"] as const;
export const assetRatios = ["3:4", "4:5", "1:1", "16:9", "21:9"] as const;
