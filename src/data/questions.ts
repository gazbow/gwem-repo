import type { Question } from "@/lib/types";

// The six version-one questions (Build Spec section 5). Wording is client-facing —
// keep it plain. Each option carries the tags the engine scores against (section 8).
//
// To add or change a question: edit this array. Icons are Tabler outline names.
// A seventh maintenance question is scaffolded below (commented out) — its answers
// carry maint:high|balanced|low and the engine already reads them if present.

export const questions: Question[] = [
  {
    id: "size",
    title: "What kind of space are we working with?",
    helper: "This sets the scale and what's realistic.",
    options: [
      {
        id: "courtyard",
        label: "Courtyard or balcony",
        helper: "Compact, often paved",
        icon: "ti-building",
        tags: ["size:small"],
      },
      {
        id: "mid",
        label: "Mid-size garden",
        helper: "A typical suburban block",
        icon: "ti-plant-2",
        tags: ["size:medium"],
      },
      {
        id: "large",
        label: "Large grounds",
        helper: "Room to zone and layer",
        icon: "ti-trees",
        tags: ["size:large"],
      },
      {
        id: "rooftop",
        label: "Rooftop terrace",
        helper: "Elevated and open to the elements",
        icon: "ti-building-skyscraper",
        tags: ["size:small", "exposed"],
      },
    ],
  },
  {
    id: "sun",
    title: "How much sun does it get?",
    helper: "This shapes the planting palette.",
    options: [
      {
        id: "full",
        label: "Full sun",
        helper: "Six hours or more",
        icon: "ti-sun",
        tags: ["sun:full"],
      },
      {
        id: "part",
        label: "Part shade",
        helper: "Sun for part of the day",
        icon: "ti-sun-low",
        tags: ["sun:part"],
      },
      {
        id: "shade",
        label: "Mostly shaded",
        helper: "Little direct sun",
        icon: "ti-umbrella",
        tags: ["sun:shade"],
      },
    ],
  },
  {
    id: "site",
    title: "What are the conditions like?",
    helper: "This matches plants to your Sydney site.",
    options: [
      {
        id: "coastal",
        label: "Coastal, salt exposed, sandy",
        helper: "Near the water, sandy soil",
        icon: "ti-beach",
        tags: ["soil:sandy", "coastal"],
      },
      {
        id: "inland",
        label: "Inland and sheltered",
        helper: "Protected, richer soil",
        icon: "ti-home",
        tags: ["soil:loam"],
      },
      {
        id: "clay",
        label: "Clay-heavy soil",
        helper: "Heavy, slow to drain",
        icon: "ti-stack",
        tags: ["soil:clay"],
      },
      {
        id: "unknown",
        label: "Not sure",
        helper: "We'll keep it forgiving",
        icon: "ti-help",
        tags: ["soil:unknown"],
      },
    ],
  },
  {
    id: "use",
    title: "How do you most want to use it?",
    helper: "Pick up to two.",
    multiSelect: true,
    maxSelect: 2,
    options: [
      {
        id: "entertain",
        label: "Entertaining",
        helper: "Hosting friends and family",
        icon: "ti-glass",
        tags: ["use:entertain"],
      },
      {
        id: "family",
        label: "Family and play",
        helper: "Space for everyday life",
        icon: "ti-mood-kid",
        tags: ["use:family"],
      },
      {
        id: "pool",
        label: "A pool and swimming",
        helper: "A place to cool off",
        icon: "ti-pool",
        tags: ["use:pool"],
      },
      {
        id: "retreat",
        label: "A quiet retreat",
        helper: "Somewhere to unwind",
        icon: "ti-yoga",
        tags: ["use:retreat"],
      },
      {
        id: "kitchen",
        label: "A kitchen garden",
        helper: "Growing food and herbs",
        icon: "ti-carrot",
        tags: ["use:kitchen"],
      },
    ],
  },
  {
    id: "who",
    title: "Who spends time out there?",
    helper: "Select all that apply.",
    multiSelect: true,
    options: [
      {
        id: "children",
        label: "Young children",
        helper: "Safety matters",
        icon: "ti-mood-kid",
        tags: ["who:children"],
      },
      {
        id: "pets",
        label: "Pets",
        helper: "Dogs, cats and the rest",
        icon: "ti-paw",
        tags: ["who:pets"],
      },
      {
        id: "adults",
        label: "Mostly adults",
        helper: "A grown-up space",
        icon: "ti-users",
        tags: ["who:adults"],
      },
    ],
  },
  {
    id: "style",
    title: "Which direction feels most you?",
    helper: "There's no wrong answer — it steers the mood.",
    options: [
      {
        id: "lush",
        label: "Lush and green",
        helper: "Layered, leafy, immersive",
        icon: "ti-plant",
        tags: ["style:lush"],
      },
      {
        id: "modern",
        label: "Structured and modern",
        helper: "Clean lines, considered form",
        icon: "ti-square",
        tags: ["style:modern"],
      },
      {
        id: "native",
        label: "Natural and native",
        helper: "Relaxed, local, low-key",
        icon: "ti-leaf",
        tags: ["style:native"],
      },
    ],
  },
  // --- Optional seventh question (Build Spec section 5, kept for a later version) ---
  // Uncomment to add. The engine already reads maint:* tags when deriving the
  // maintenance note; no engine change is needed.
  //
  // {
  //   id: "maint",
  //   title: "How hands-on do you want to be?",
  //   helper: "This tunes the upkeep.",
  //   options: [
  //     { id: "high", label: "Hands on", helper: "Happy to potter", icon: "ti-shovel", tags: ["maint:high"] },
  //     { id: "balanced", label: "A balance", helper: "Some care, not a chore", icon: "ti-scale", tags: ["maint:balanced"] },
  //     { id: "low", label: "Close to effortless", helper: "Set and forget", icon: "ti-clock", tags: ["maint:low"] },
  //   ],
  // },
];
