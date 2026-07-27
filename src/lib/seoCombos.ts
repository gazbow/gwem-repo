import type { Answers } from "@/lib/types";

// A handful of common answer combinations pre-built as indexable result pages
// (Build Spec section 11). Each becomes /guide/<slug> with clean, crawlable text
// and FAQ-style JSON-LD so search engines and AI tools have real content to cite.

export interface SeoCombo {
  slug: string;
  title: string; // page H1 / <title>
  intro: string; // one-paragraph lead
  answers: Answers;
}

export const seoCombos: SeoCombo[] = [
  {
    slug: "coastal-native-garden-sydney",
    title: "A coastal native garden for Sydney's Eastern Suburbs",
    intro:
      "For a full-sun, salt-exposed, sandy site by the water, a natural and native direction earns its keep — hardy, textural and made for the coast.",
    answers: {
      size: ["mid"],
      sun: ["full"],
      site: ["coastal"],
      use: ["entertain"],
      who: ["adults"],
      style: ["native"],
    },
  },
  {
    slug: "modern-courtyard-garden",
    title: "A structured, modern courtyard garden",
    intro:
      "A compact, sun-touched courtyard suits a modern direction: clean lines, a tight material palette and a few strong repeated plants.",
    answers: {
      size: ["courtyard"],
      sun: ["part"],
      site: ["inland"],
      use: ["entertain", "retreat"],
      who: ["adults"],
      style: ["modern"],
    },
  },
  {
    slug: "lush-family-garden-sydney",
    title: "A lush family garden for young children",
    intro:
      "A mid-size, sunny family garden built around a lush, green direction — safe planting, room to play and shade for the long afternoons.",
    answers: {
      size: ["mid"],
      sun: ["full"],
      site: ["inland"],
      use: ["family"],
      who: ["children", "pets"],
      style: ["lush"],
    },
  },
  {
    slug: "shaded-courtyard-retreat",
    title: "A shaded courtyard retreat",
    intro:
      "For a mostly shaded courtyard, a lush retreat leans on ferns, layered green and the soft sound of water to slow the space down.",
    answers: {
      size: ["courtyard"],
      sun: ["shade"],
      site: ["inland"],
      use: ["retreat"],
      who: ["adults"],
      style: ["lush"],
    },
  },
  {
    slug: "large-modern-grounds-lap-pool",
    title: "Large modern grounds with a lap pool",
    intro:
      "Generous grounds in full sun lend themselves to a modern direction with a lap pool as the centrepiece and considered outdoor rooms around it.",
    answers: {
      size: ["large"],
      sun: ["full"],
      site: ["inland"],
      use: ["pool", "entertain"],
      who: ["adults"],
      style: ["modern"],
    },
  },
  {
    slug: "clay-soil-modern-garden",
    title: "A modern garden for clay-heavy soil",
    intro:
      "Clay soil needn't limit a considered garden — the right structural planting thrives in it, with clean edges and evergreen form.",
    answers: {
      size: ["mid"],
      sun: ["part"],
      site: ["clay"],
      use: ["entertain"],
      who: ["adults"],
      style: ["modern"],
    },
  },
];

export function getCombo(slug: string): SeoCombo | undefined {
  return seoCombos.find((c) => c.slug === slug);
}
