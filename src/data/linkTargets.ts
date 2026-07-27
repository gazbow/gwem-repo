import type { LinkTarget } from "@/lib/types";

// Link targets mapped to real, confirmed Landart pages (Build Spec section 7). URLs are
// site-relative paths (trailing slash matches the live site) resolved at render time.
//
// `matchTags` decide when a link is offered: a link is eligible when ANY of its
// tags overlaps the visitor's answer set. Capped at three in the engine.

export const linkTargets: LinkTarget[] = [
  // --- Services ------------------------------------------------------------
  {
    label: "Garden Design Sydney",
    url: "/services/garden-design-sydney/",
    kind: "service",
    matchTags: ["style:lush", "style:modern", "style:native", "size:medium", "size:large"],
    priority: 9,
  },
  {
    label: "Landscaping & Construction",
    url: "/services/landscaping/",
    kind: "service",
    matchTags: ["use:retreat", "use:kitchen", "coastal", "style:native", "style:lush"],
    priority: 7,
  },
  {
    label: "Plunge Pools",
    url: "/plunge-pools/",
    kind: "service",
    matchTags: ["use:pool", "size:small", "size:medium", "style:modern"],
    priority: 8,
  },
  {
    label: "Pool Design & Build",
    url: "/services/pool-design-build-sydney/",
    kind: "service",
    matchTags: ["use:pool", "size:large"],
    priority: 7,
  },
  {
    label: "Home Building",
    url: "/services/home-building/",
    kind: "service",
    matchTags: ["use:entertain", "size:large", "style:modern"],
    priority: 6,
  },
  {
    label: "Elevate Your Home's Exterior",
    url: "/elevate-your-homes-exterior/",
    kind: "service",
    matchTags: ["use:entertain", "use:retreat", "style:modern", "style:lush"],
    priority: 5,
  },
  {
    label: "Garden Maintenance Sydney",
    url: "/services/garden-maintenance-sydney/",
    kind: "service",
    matchTags: ["maint:managed", "maint:high", "style:lush", "use:kitchen"],
    priority: 8,
  },

  // --- Article -------------------------------------------------------------
  {
    label: "Beautiful ways to landscape around a pool",
    url: "/beautiful-ways-to-landscape-around-a-pool/",
    kind: "article",
    matchTags: ["use:pool"],
    priority: 6,
  },

  // --- Projects (gallery) --------------------------------------------------
  {
    label: "Project: Balgowlah garden & pool",
    url: "/project/sydney-garden-design-pool-design/",
    kind: "project",
    matchTags: ["use:pool", "coastal", "style:modern", "size:large"],
    priority: 7,
  },
  {
    label: "Project: Lindfield garden",
    url: "/project/lindfield/",
    kind: "project",
    matchTags: ["style:lush", "style:native", "size:medium", "use:family"],
    priority: 6,
  },
];
