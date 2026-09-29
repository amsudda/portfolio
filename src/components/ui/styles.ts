/** Shared class recipes for the public site's square, corporate buttons and links. */

const variants = {
  primary: "bg-green text-on-green hover:bg-green-hover",
  outlineDark: "border border-white/28 text-white hover:border-green",
  ink: "bg-ink text-white hover:bg-[#1C1F1C]",
  outlineOnGreen: "border border-on-green-deep/45 text-on-green-deep hover:border-on-green-deep",
};

const sizes = {
  lg: "px-[26px] py-4 text-[15.5px]",
  wide: "px-7 py-4 text-[15.5px]",
  md: "px-6 py-[15px] text-[15px]",
};

export function button(variant: keyof typeof variants, size: keyof typeof sizes = "lg"): string {
  return `inline-flex items-center justify-center gap-2.5 font-display font-semibold transition-colors ${variants[variant]} ${sizes[size]}`;
}

export const btn = {
  primary: button("primary"),
  outlineDark: button("outlineDark"),
  ink: button("ink", "wide"),
  outlineOnGreen: button("outlineOnGreen", "wide"),
  underline:
    "inline-flex items-center gap-2 border-b-2 border-green pb-1 font-display text-[15px] font-semibold text-ink transition-colors hover:text-green-deep",
};

export const eyebrowLight = "eyebrow text-green-deep";
export const eyebrowDark = "eyebrow text-green-bright";
