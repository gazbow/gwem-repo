import type { StyleProfile } from "@/lib/types";

// Style profiles (Build Spec section 7). Selected directly from the style:* answer.
// The summary opens the result like a design conversation, not a plant dump.

export const styleProfiles: StyleProfile[] = [
  {
    id: "style:lush",
    name: "Lush and green",
    summary:
      "Layered, immersive planting that wraps the space in green. Think canopy, understorey and groundcover working together, so the garden feels established from the first season and cooler on a hot Sydney afternoon.",
    materials:
      "Warm timber decking, sandstone, and generous soft planting. Muted greens and natural tones, with foliage doing the heavy lifting rather than hard surfaces.",
  },
  {
    id: "style:modern",
    name: "Structured and modern",
    summary:
      "Clean lines, considered form and a restrained palette. Clipped hedging, defined edges and a few strong repeated plants give the garden a calm, architectural order that sits comfortably against contemporary Sydney homes.",
    materials:
      "Honed concrete, large-format pavers, rendered walls and dark-framed steel. A tight material palette in charcoal, stone and off-white, with planting used as sculpture.",
  },
  {
    id: "style:native",
    name: "Natural and native",
    summary:
      "A relaxed, local feel that belongs to its coastal Sydney setting. Textural native grasses, salt-hardy shrubs and informal drifts create a low-key garden that supports birds and pollinators and asks little of you in return.",
    materials:
      "Sandstone, gravel, weathered timber and rammed earth. Earthy, sun-bleached tones that echo the bush and the coast, with planting left to move and self-soften.",
  },
];
