import type { Feature } from "@/lib/types";

// Suggested features scored against use, size and who (Build Spec sections 7 & 8).
//   requiresSize — hard gate on the site size tag (e.g. a lap pool needs size:large).
//   prefers      — soft boosts for use / who / style / conditions.
//   avoid        — drop if the tag is present.
//   link         — a Landart page (site-relative path; resolved to the live site).
//
// To add a feature: append an entry. Links are confirmed against the live site before launch.

export const features: Feature[] = [
  {
    id: "plunge-pool",
    name: "Plunge pool",
    note: "A compact pool that cools you off without swallowing the whole garden.",
    prefers: ["use:pool", "use:entertain", "size:small", "size:medium", "style:modern"],
    link: "/plunge-pools",
    maintenance: "balanced",
    priority: 9,
  },
  {
    id: "lap-pool",
    name: "Lap pool",
    note: "A long, lean pool for swimming laps and drawing the eye down the garden.",
    prefers: ["use:pool", "use:entertain", "style:modern"],
    requiresSize: ["size:large"],
    link: "/services/garden-design-sydney",
    maintenance: "balanced",
    priority: 7,
  },
  {
    id: "fire-pit",
    name: "Fire pit",
    note: "A warm gathering point that stretches the garden into the cooler months.",
    prefers: ["use:entertain", "use:retreat", "who:adults", "style:native", "style:modern"],
    maintenance: "low",
    priority: 6,
  },
  {
    id: "outdoor-kitchen",
    name: "Outdoor kitchen",
    note: "Built-in cooking and prep so entertaining stays outside all evening.",
    prefers: ["use:entertain", "who:adults", "size:medium", "size:large", "style:modern"],
    avoid: ["size:small"], // needs room — not for courtyards, balconies or rooftops
    link: "/services/home-building",
    maintenance: "low",
    priority: 7,
  },
  {
    id: "screening-hedging",
    name: "Screening and hedging",
    note: "Green walls for privacy, wind protection and a sense of enclosure.",
    prefers: ["use:retreat", "size:small", "size:medium", "coastal", "style:modern", "style:lush"],
    link: "/services/garden-design-sydney",
    maintenance: "balanced",
    priority: 8,
  },
  {
    id: "feature-lighting",
    name: "Feature lighting",
    note: "Layered low-voltage lighting that lets the garden work after dark.",
    prefers: ["use:entertain", "use:retreat", "style:modern", "style:lush"],
    link: "/elevate-your-homes-exterior",
    maintenance: "low",
    priority: 7,
  },
  {
    id: "water-feature",
    name: "Water feature",
    note: "The soft sound of water to settle a courtyard or retreat.",
    prefers: ["use:retreat", "style:lush", "style:modern"],
    maintenance: "balanced",
    priority: 5,
  },
  {
    id: "deck-pergola",
    name: "Deck or pergola",
    note: "A shaded, level outdoor room that connects the house to the garden.",
    prefers: ["use:entertain", "use:retreat", "size:small", "size:medium", "size:large", "style:lush", "style:modern"],
    link: "/elevate-your-homes-exterior",
    maintenance: "low",
    priority: 8,
  },
  {
    id: "childrens-lawn",
    name: "Children's lawn",
    note: "A tough, open patch of turf for play that still looks considered.",
    prefers: ["use:family", "who:children", "who:pets", "size:medium", "size:large"],
    maintenance: "balanced",
    priority: 6,
  },
  {
    id: "raised-kitchen-beds",
    name: "Raised kitchen beds",
    note: "Waist-high beds for herbs and veg, easy to reach and easy to love.",
    prefers: ["use:kitchen", "use:family", "sun:full", "style:native", "style:lush"],
    maintenance: "balanced",
    priority: 6,
  },
];
