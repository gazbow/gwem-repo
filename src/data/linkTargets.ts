import type { LinkTarget } from "@/lib/types";

// Link targets mapped to real Landart pages performing in search / AI citation
// (Build Spec section 7). URLs are site-relative paths resolved against the live
// Landart site at render time. Confirm final URLs against the live site before launch.
//
// `matchTags` decide when a link is offered: a link is eligible when ANY of its
// tags overlaps the visitor's answer set. Capped at three in the engine.

export const linkTargets: LinkTarget[] = [
  // --- Services ------------------------------------------------------------
  {
    label: "Garden Design Sydney",
    url: "/services/garden-design-sydney",
    kind: "service",
    matchTags: ["style:lush", "style:modern", "style:native", "size:medium", "size:large"],
    priority: 9,
  },
  {
    label: "Plunge Pools",
    url: "/plunge-pools",
    kind: "service",
    matchTags: ["use:pool", "size:small", "size:medium", "style:modern"],
    priority: 8,
  },
  {
    label: "Home Building",
    url: "/services/home-building",
    kind: "service",
    matchTags: ["use:entertain", "size:large", "style:modern"],
    priority: 6,
  },
  {
    label: "Elevate Your Home's Exterior",
    url: "/elevate-your-homes-exterior",
    kind: "service",
    matchTags: ["use:entertain", "use:retreat", "style:modern", "style:lush"],
    priority: 6,
  },

  // --- Articles ------------------------------------------------------------
  {
    label: "Getting the best from coastal Sydney soils",
    url: "/articles/coastal-soils",
    kind: "article",
    matchTags: ["soil:sandy", "coastal"],
    priority: 7,
  },
  {
    label: "Tiger grass for privacy and screening",
    url: "/articles/tiger-grass",
    kind: "article",
    matchTags: ["use:retreat", "style:lush", "coastal"],
    priority: 5,
  },
  {
    label: "Biophilic design and bringing the garden inside",
    url: "/articles/biophilic-interiors",
    kind: "article",
    matchTags: ["style:lush", "use:retreat", "sun:shade"],
    priority: 5,
  },
  {
    label: "Why the jacaranda still defines a Sydney summer",
    url: "/articles/jacaranda",
    kind: "article",
    matchTags: ["style:lush", "style:native", "size:large"],
    priority: 4,
  },

  // --- Projects (gallery) --------------------------------------------------
  {
    label: "Project: a coastal native garden",
    url: "/projects/coastal-native",
    kind: "project",
    matchTags: ["coastal", "soil:sandy", "style:native"],
    priority: 7,
  },
  {
    label: "Project: a structured modern courtyard",
    url: "/projects/modern-courtyard",
    kind: "project",
    matchTags: ["style:modern", "size:small", "use:entertain"],
    priority: 7,
  },
  {
    label: "Project: a lush family garden",
    url: "/projects/lush-family",
    kind: "project",
    matchTags: ["style:lush", "use:family", "who:children"],
    priority: 7,
  },
  {
    label: "Project: grounds with a lap pool",
    url: "/projects/lap-pool-grounds",
    kind: "project",
    matchTags: ["use:pool", "size:large", "style:modern"],
    priority: 6,
  },
];
