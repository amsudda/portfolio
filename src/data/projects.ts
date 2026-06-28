export type ProjectCategory =
  | "Brand Film"
  | "Commercial"
  | "Event"
  | "Social / Reels"
  | "Documentary";

export type MediaBlock =
  | { type: "video"; url: string; aspect?: "16/9" | "9/16" | "1/1"; caption?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "text"; heading?: string; body: string };

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  category: ProjectCategory;
  role: string;
  deliverables: string[];
  hook: string; // 1-line teaser shown on hover/card
  brief: string;
  approach: string;
  process: MediaBlock[];
  result: string;
  metric?: { value: string; label: string };
  testimonial?: { quote: string; author: string; role?: string };
  heroVideoUrl: string; // YouTube/Vimeo URL — placeholder for now
  thumbnail: {
    // Gradient placeholder spec until real posters land
    from: string;
    to: string;
    label?: string;
  };
}

export const projects: Project[] = [
  {
    id: "p1",
    slug: "northwind-origin",
    title: "Origin",
    client: "Northwind Coffee",
    year: 2025,
    category: "Brand Film",
    role: "Director, DP, Editor",
    deliverables: ["90s Hero Film", "30s Cutdown", "6× Social Reels"],
    hook: "A coffee roaster's first decade, told in a single morning shift.",
    brief:
      "Northwind was approaching its tenth year and wanted a brand film that moved beyond product shots. The ask: a piece that anchored the company in craft and people — something that could open investor conversations and live at the top of their site for the next two years.",
    approach:
      "We resisted the urge to narrate. Instead, we built the film around one continuous morning at the roastery — letting machinery, hands, and ambient sound carry the story. Shot on an Alexa Mini with vintage Zeiss glass for organic texture; graded warm with lifted blacks to feel lived-in rather than polished.",
    process: [
      {
        type: "text",
        heading: "Pre-production",
        body: "Two weeks of location scouting and shadowing the morning team. We mapped a shot list to the actual rhythm of the shift so the crew never broke the workflow.",
      },
      {
        type: "video",
        url: "",
        aspect: "16/9",
        caption: "Behind-the-scenes: the 4:30 AM roast cycle",
      },
      {
        type: "text",
        heading: "Production",
        body: "Single-camera, two-person crew over three mornings. Natural light only, supplemented with a single bounce. Sound recorded live — no foley in post.",
      },
      {
        type: "video",
        url: "",
        aspect: "9/16",
        caption: "Vertical cutdown for Instagram",
      },
      {
        type: "quote",
        text: "They disappeared into the room. By day two we forgot they were filming.",
        attribution: "Head Roaster, Northwind",
      },
    ],
    result:
      "The film became the centerpiece of Northwind's anniversary campaign and is now the first thing visitors see on the homepage. It was selected for two regional craft-film showcases and directly cited in their successful Series A pitch deck.",
    metric: { value: "+34%", label: "site engagement vs. prior hero" },
    testimonial: {
      quote:
        "It captured something we'd been trying to articulate for ten years. The team watches it before every offsite.",
      author: "Mara Ellis",
      role: "Founder, Northwind Coffee",
    },
    heroVideoUrl: "",
    thumbnail: { from: "#3a2a1a", to: "#7a4a2a", label: "Origin" },
  },
  {
    id: "p2",
    slug: "halcyon-launch",
    title: "Quiet Power",
    client: "Halcyon Audio",
    year: 2025,
    category: "Commercial",
    role: "Editor, Colorist",
    deliverables: ["60s TV Spot", "15s Pre-roll", "Cinema 4K Master"],
    hook: "A product launch that opens with silence — and earns it.",
    brief:
      "Halcyon's flagship headphone needed a launch spot that competed in a crowded category without resorting to the usual quick-cut, EDM-driven formula. Goal: feel premium, feel calm, feel inevitable.",
    approach:
      "We cut to the rhythm of breath, not music. The first eighteen seconds carry no score — only room tone and a single product gesture. The score enters only when the user does. Color was pulled toward cool neutrals with a single warm key light on the product to make it the only living thing on screen.",
    process: [
      {
        type: "text",
        heading: "The edit",
        body: "Forty hours of footage cut to a 60-second master, then bracketed into a 30 and two 15s. Each cutdown preserves the silent opening — that was the rule.",
      },
      {
        type: "video",
        url: "",
        aspect: "16/9",
        caption: "Final 60s spot",
      },
      {
        type: "text",
        heading: "Color",
        body: "Graded in DaVinci Resolve. Custom LUT built from a base ARRI K1S1 with cool shadow rolloff. Skin tones held with a qualifier-driven secondary.",
      },
    ],
    result:
      "Spot ran across YouTube pre-roll and cinema in five markets. Halcyon reported the strongest launch-week direct traffic in company history.",
    metric: { value: "2.1M", label: "organic views in week one" },
    heroVideoUrl: "",
    thumbnail: { from: "#1a2030", to: "#2a3a55", label: "Quiet Power" },
  },
  {
    id: "p3",
    slug: "field-notes-doc",
    title: "Field Notes",
    client: "Atlas Foundation",
    year: 2024,
    category: "Documentary",
    role: "DP, Co-Editor",
    deliverables: ["22min Documentary", "3× Chapter Reels", "Festival Master"],
    hook: "Three soil scientists. One drought year. A film about patience.",
    brief:
      "Atlas commissioned a long-form piece to accompany a five-year research grant. The film needed to work for two very different audiences: scientific peers reviewing the grant, and a general public that funds the foundation.",
    approach:
      "We structured the film around the seasons rather than the science. The data is there — overlaid sparingly — but the spine is three people doing slow, careful work in a landscape that doesn't reward urgency.",
    process: [
      {
        type: "text",
        heading: "A year on location",
        body: "Eleven trips across fourteen months. We shot in every season so the land itself became a character.",
      },
      {
        type: "video",
        url: "",
        aspect: "16/9",
        caption: "Chapter One: Spring",
      },
      {
        type: "quote",
        text: "The first cut made me cry, and I'm the one who lived it.",
        attribution: "Dr. Imani Reyes, Lead Researcher",
      },
      {
        type: "video",
        url: "",
        aspect: "9/16",
        caption: "Festival teaser",
      },
    ],
    result:
      "Selected for two environmental film festivals and used by Atlas as the lead asset in their next grant cycle, which closed 40% over goal.",
    metric: { value: "2 festivals", label: "official selection" },
    heroVideoUrl: "",
    thumbnail: { from: "#1f2a1a", to: "#3a4a28", label: "Field Notes" },
  },
  {
    id: "p4",
    slug: "meridian-summit",
    title: "Summit",
    client: "Meridian Group",
    year: 2024,
    category: "Event",
    role: "Lead Editor",
    deliverables: ["3min Recap", "12× Speaker Cuts", "Sizzle Reel"],
    hook: "A two-day conference, cut into a film that earned a standing ovation at closing.",
    brief:
      "Meridian's annual summit needed a same-week recap film to anchor post-event marketing and a sizzle reel that could play at the closing keynote — meaning the edit had to finish during the event itself.",
    approach:
      "We embedded a three-person edit bay on site. Footage moved from camera to NLE within the hour. By prioritizing emotional through-lines over coverage, we delivered a film that felt authored, not assembled.",
    process: [
      {
        type: "text",
        heading: "On-site post",
        body: "A pop-up edit suite running two Resolve stations and a shared media pool. Turnaround: 36 hours from final keynote to playback.",
      },
      {
        type: "video",
        url: "",
        aspect: "16/9",
        caption: "Closing-night recap film",
      },
    ],
    result:
      "The recap played at the closing session to a standing ovation. Meridian extended the engagement to a multi-year contract.",
    heroVideoUrl: "",
    thumbnail: { from: "#2a1a2a", to: "#4a2a45", label: "Summit" },
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getAdjacentProjects = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
};
