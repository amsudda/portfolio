export type ProjectCategory =
  | "Short-Form Social"
  | "Paid Ad Campaign"
  | "Product Launch"
  | "Brand Content"
  | "Long-Form";

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
  role: string; // what we handled — e.g. "Strategy · Production · Edit"
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
    // Gradient placeholder spec until real posters land.
    // If `image` is set (a URL or uploaded data URL) it's used as the poster instead.
    from: string;
    to: string;
    label?: string;
    image?: string;
  };
}

export const projects: Project[] = [
  {
    id: "p1",
    slug: "lumi-glow-launch",
    title: "Glow Story",
    client: "Lumi Skincare",
    year: 2025,
    category: "Short-Form Social",
    role: "Strategy · Production · Edit",
    deliverables: ["12× Reels / TikToks", "4× Paid Cutdowns", "Hook Test Pack"],
    hook: "A serum launch built for the For You page — 12 vertical pieces in three weeks.",
    brief:
      "Lumi was launching a new serum into a crowded skincare market with no existing social presence. They needed to build awareness fast on TikTok and Reels — and the content had to feel native to the feed, not like a TV ad squeezed into vertical.",
    approach:
      "We didn't make one hero film — we built a content engine. A batch of hook-first vertical pieces, each opening on a different angle (texture, before/after, founder voice, fast routine), so we could test what the algorithm rewarded and double down. Shot fast and clean, lit to look like daylight, cut to land the hook inside the first second.",
    process: [
      {
        type: "text",
        heading: "Strategy & hooks",
        body: "We mapped twelve hook angles to the launch goals before a camera came out. Every concept had to earn its first 1.5 seconds — that's where the scroll is won or lost.",
      },
      {
        type: "video",
        url: "",
        aspect: "9/16",
        caption: "Top-performing hook: the 5-second texture test",
      },
      {
        type: "text",
        heading: "Batch production",
        body: "One studio day, a single talent, and a tight shot list captured all twelve concepts plus stills. Volume by design — that's what feeds an always-on social calendar.",
      },
      {
        type: "video",
        url: "",
        aspect: "9/16",
        caption: "Founder-voice cut for the launch week",
      },
      {
        type: "quote",
        text: "Three of the pieces went off on their own. We sold out the first batch before we'd even spent on ads.",
        attribution: "Founder, Lumi Skincare",
      },
    ],
    result:
      "The launch batch pulled 3.4M organic views in its first month and took Lumi from a standing start to a real social presence. The serum sold out its opening run, and the top three hooks became the backbone of their paid campaign.",
    metric: { value: "3.4M", label: "organic views in month one" },
    testimonial: {
      quote:
        "They understood the feed better than we did. It didn't look like an ad — and that's exactly why it worked.",
      author: "Priya Anand",
      role: "Founder, Lumi Skincare",
    },
    heroVideoUrl: "",
    thumbnail: { from: "#1f3320", to: "#3f7a32", label: "Glow Story" },
  },
  {
    id: "p2",
    slug: "fern-field-always-on",
    title: "Always-On",
    client: "Fern & Field",
    year: 2025,
    category: "Paid Ad Campaign",
    role: "Concept · Production · Post",
    deliverables: ["20× Ad Variants", "Hook Test Matrix", "Static + Motion Pack"],
    hook: "Performance creative that cut their cost-per-acquisition by a third.",
    brief:
      "Fern & Field, a home-goods brand, had plateaued on paid social. The same few ads had run for months and creative fatigue was driving their cost-per-acquisition up. They needed a steady stream of fresh, on-brand creative built specifically to test and convert.",
    approach:
      "We treated creative as a system, not a one-off. A matrix of hooks, formats, and angles produced from a single shoot — modular edits we could recombine, so the brand always had something new in rotation. Every variant was framed for the platform and built around a clear, scroll-stopping first frame.",
    process: [
      {
        type: "text",
        heading: "The testing matrix",
        body: "Five hooks × four formats from one production day. Modular b-roll and statics meant we could assemble twenty distinct ads without twenty separate shoots.",
      },
      {
        type: "video",
        url: "",
        aspect: "9/16",
        caption: "Winning variant — problem/solution hook",
      },
      {
        type: "text",
        heading: "Read, cut, repeat",
        body: "We watched the numbers with the brand each week and recut around the winners — trimming hooks, swapping openers, and refreshing the angles that were fatiguing.",
      },
    ],
    result:
      "The new creative dropped cost-per-acquisition by 32% within six weeks and gave Fern & Field a repeatable content pipeline instead of a one-time burst. The account has stayed in profit on paid social ever since.",
    metric: { value: "-32%", label: "cost per acquisition" },
    testimonial: {
      quote:
        "For the first time our ads stopped fatiguing, because there was always something new and on-brand to swap in.",
      author: "Daniel Brooks",
      role: "Head of Growth, Fern & Field",
    },
    heroVideoUrl: "",
    thumbnail: { from: "#1a2030", to: "#2a3a55", label: "Always-On" },
  },
  {
    id: "p3",
    slug: "northpeak-unboxed",
    title: "Unboxed",
    client: "Northpeak",
    year: 2025,
    category: "Product Launch",
    role: "Strategy · Film · Photo · Edit",
    deliverables: ["Launch Film (16:9 + 9:16)", "6× Teaser Reels", "Photography Set"],
    hook: "A product drop teased, launched, and sustained across a full content calendar.",
    brief:
      "Northpeak was releasing a new piece of outdoor gear and wanted more than a single launch video — they needed a coordinated rollout that built anticipation, landed the launch, and kept momentum going for weeks after.",
    approach:
      "We planned the content as a campaign arc: cryptic teasers to build curiosity, a hero launch film for the drop, then a steady run of sustain reels and stills to keep the product in feed. One production captured everything — motion and photography — so the whole calendar stayed visually consistent.",
    process: [
      {
        type: "text",
        heading: "The rollout",
        body: "Three phases — tease, launch, sustain — mapped to a four-week calendar before we shot a frame. Each asset had a job and a slot.",
      },
      {
        type: "video",
        url: "",
        aspect: "16/9",
        caption: "Hero launch film",
      },
      {
        type: "video",
        url: "",
        aspect: "9/16",
        caption: "Teaser cut — day one",
      },
      {
        type: "quote",
        text: "It felt like a launch with a heartbeat. Every few days there was something new dropping.",
        attribution: "Marketing Lead, Northpeak",
      },
    ],
    result:
      "The drop sold out its first run in 72 hours, and the sustain content kept engagement high through the following month instead of spiking and fading. Northpeak now runs every release on the same rollout playbook.",
    metric: { value: "72 hrs", label: "to sell out the first run" },
    heroVideoUrl: "",
    thumbnail: { from: "#2a1a2a", to: "#4a2a45", label: "Unboxed" },
  },
  {
    id: "p4",
    slug: "atlas-the-build",
    title: "The Build",
    client: "Atlas Coffee Co.",
    year: 2024,
    category: "Long-Form",
    role: "Direction · DP · Edit",
    deliverables: ["3× YouTube Episodes", "9× Shorts Cutdowns", "Thumbnails"],
    hook: "A YouTube series that turned a founder's story into a subscriber engine.",
    brief:
      "Atlas had a strong short-form presence but no depth — plenty of reach, little trust. They wanted long-form content on YouTube that let people actually get to know the brand and the people behind it, and that could feed their short-form channels at the same time.",
    approach:
      "We built a docu-style episodic series following the founders through a real season of the business. Long-form for YouTube to build trust and watch time, then cut down into Shorts and reels so a single shoot fed every platform. Honest, unhurried, and made to be watched all the way through.",
    process: [
      {
        type: "text",
        heading: "One shoot, every platform",
        body: "We shot each episode to live as a 10-minute YouTube piece and as a dozen vertical cutdowns — so long-form and short-form pulled from the same well.",
      },
      {
        type: "video",
        url: "",
        aspect: "16/9",
        caption: "Episode One: The First Roast",
      },
      {
        type: "video",
        url: "",
        aspect: "9/16",
        caption: "Shorts cutdown from Episode One",
      },
    ],
    result:
      "The series added 12,000 subscribers in 90 days and gave Atlas a library of content that kept working long after launch. Watch time on the channel more than tripled, and the Shorts cutdowns became some of their best-performing posts of the year.",
    metric: { value: "+12k", label: "subscribers in 90 days" },
    testimonial: {
      quote:
        "Short-form got us seen. This got us trusted — and it fed the short-form too. Best return we've had on content.",
      author: "Mara Ellis",
      role: "Founder, Atlas Coffee Co.",
    },
    heroVideoUrl: "",
    thumbnail: { from: "#3a2a1a", to: "#7a4a2a", label: "The Build" },
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
