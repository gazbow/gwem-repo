import type {
  Answers,
  Feature,
  GuideResult,
  MaintenanceLoad,
  Plant,
  Tag,
} from "@/lib/types";
import { questions } from "@/data/questions";
import { plants as defaultPlants } from "@/data/plants";
import { features as defaultFeatures } from "@/data/features";
import { styleProfiles } from "@/data/styleProfiles";
import { linkTargets } from "@/data/linkTargets";
import { gardenImages } from "@/data/gardenImages";
import { resultSizing, resolveLandartUrl, scoring } from "@/data/config";

// Rules-based, deterministic scoring — no machine learning (Build Spec section 8).

/**
 * Turn raw answers into a readable question → chosen-label(s) list.
 * Used for the internal lead-notification email so the team can see the brief at a glance.
 */
export function summariseAnswers(answers: Answers): { question: string; value: string }[] {
  const summary: { question: string; value: string }[] = [];
  for (const question of questions) {
    const chosen = answers[question.id] ?? [];
    if (chosen.length === 0) continue;
    const labels = chosen
      .map((optionId) => question.options.find((o) => o.id === optionId)?.label)
      .filter((l): l is string => Boolean(l));
    if (labels.length) summary.push({ question: question.title, value: labels.join(", ") });
  }
  return summary;
}

/** Collect every tag implied by the visitor's answers into a Set. */
export function collectTags(answers: Answers): Set<Tag> {
  const tags = new Set<Tag>();
  for (const question of questions) {
    const chosen = answers[question.id] ?? [];
    for (const optionId of chosen) {
      const option = question.options.find((o) => o.id === optionId);
      if (option) option.tags.forEach((t) => tags.add(t));
    }
  }
  return tags;
}

interface Scored<T> {
  item: T;
  score: number;
  priority: number;
}

/**
 * Score an item against the answer tag set.
 * Returns null if the item is disqualified (missing a hard requirement, or carrying
 * an `avoid` tag that is present in the answers).
 */
function scoreItem(
  item: {
    requires?: Tag[];
    requiresSize?: Tag[];
    prefers: Tag[];
    avoid?: Tag[];
    priority?: number;
  },
  tags: Set<Tag>,
): Scored<typeof item> | null {
  const hardRequirements = [...(item.requires ?? []), ...(item.requiresSize ?? [])];

  // Disqualify if any hard requirement is missing.
  for (const req of hardRequirements) {
    if (!tags.has(req)) return null;
  }

  // Disqualify if any avoid tag is present (e.g. unsafe around who:children).
  for (const bad of item.avoid ?? []) {
    if (tags.has(bad)) return null;
  }

  let score = 0;
  for (const req of hardRequirements) score += scoring.requiresMatch; // +2 each
  for (const pref of item.prefers) if (tags.has(pref)) score += scoring.prefersMatch; // +1 each

  return { item, score, priority: item.priority ?? 0 };
}

/** Sort by score, then curated priority, then a stable id/label tiebreak. */
function rank<T extends { id?: string; label?: string }>(scored: Scored<T>[]): Scored<T>[] {
  const key = (item: T) => item.id ?? item.label ?? "";
  return [...scored].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.priority !== a.priority) return b.priority - a.priority;
    return key(a.item).localeCompare(key(b.item));
  });
}

/** Pick the hero image whose tags best overlap the answer set (default is the fallback). */
function pickGardenImage(tags: Set<Tag>) {
  const fallback = gardenImages.find((g) => g.id === "default") ?? gardenImages[0];
  let best = fallback;
  let bestScore = 0; // only genuine matches (score > 0) can beat the fallback
  for (const img of gardenImages) {
    if (img.id === "default") continue;
    const score = img.tags.filter((t) => tags.has(t)).length;
    if (score > bestScore || (score === bestScore && score > 0 && img.priority > best.priority)) {
      best = img;
      bestScore = score;
    }
  }
  return best;
}

const LOAD_VALUE: Record<MaintenanceLoad, number> = { low: 1, balanced: 2, high: 3 };

/** Derive a plain-language maintenance note from selected items + the optional Q7 answer. */
function maintenanceNote(
  selectedPlants: Plant[],
  selectedFeatures: Feature[],
  tags: Set<Tag>,
): string {
  const loads = [
    ...selectedPlants.map((p) => LOAD_VALUE[p.maintenance]),
    ...selectedFeatures.map((f) => LOAD_VALUE[f.maintenance]),
  ];
  const avg = loads.length ? loads.reduce((a, b) => a + b, 0) / loads.length : 2;

  // Optional Q7 (maint:*) nudges the derived band if present.
  let band: MaintenanceLoad = avg < 1.6 ? "low" : avg < 2.4 ? "balanced" : "high";
  if (tags.has("maint:low")) band = band === "high" ? "balanced" : "low";
  if (tags.has("maint:high")) band = band === "low" ? "balanced" : "high";

  switch (band) {
    case "low":
      return "This direction is built to be close to effortless. The planting is hardy and slow-growing, so beyond a seasonal tidy and a check of the irrigation, it largely looks after itself.";
    case "high":
      return "This is a hands-on garden that rewards the attention — expect regular clipping, feeding and seasonal replanting to keep it at its best. Many clients pair it with a maintenance visit to stay on top of the detail.";
    default:
      return "The upkeep here is moderate and predictable: a clip and feed through the growing season, occasional pruning to hold the shapes, and a light hand the rest of the year. Comfortable for a keen owner, easy to hand to a gardener.";
  }
}

export interface EngineOptions {
  plants?: Plant[];
  features?: Feature[];
}

/** Generate the full tailored result from a set of answers. Pure and deterministic. */
export function generateResult(answers: Answers, opts: EngineOptions = {}): GuideResult {
  const plants = opts.plants ?? defaultPlants;
  const features = opts.features ?? defaultFeatures;
  const tags = collectTags(answers);

  // --- Hero image: highest tag-overlap match, falling back to the default. ---
  const image = pickGardenImage(tags);

  // --- Style: picked directly from the style:* answer (fallback to native). ---
  const styleTag = [...tags].find((t) => t.startsWith("style:"));
  const style =
    styleProfiles.find((s) => s.id === styleTag) ??
    styleProfiles.find((s) => s.id === "style:native")!;

  // --- Plants ---
  const scoredPlants = plants
    .map((p) => scoreItem(p, tags))
    .filter((x): x is Scored<Plant> => x !== null) as Scored<Plant>[];
  const rankedPlants = rank(scoredPlants).slice(0, resultSizing.plantsMax);
  const selectedPlants = rankedPlants.map((s) => s.item);

  // --- Features ---
  const scoredFeatures = features
    .map((f) => scoreItem(f, tags))
    .filter((x): x is Scored<Feature> => x !== null) as Scored<Feature>[];
  const rankedFeatures = rank(scoredFeatures).slice(0, resultSizing.featuresMax);
  const selectedFeatures = rankedFeatures.map((s) => s.item);

  // --- Links: any matchTags overlap, ranked, capped at three. ---
  const scoredLinks = linkTargets
    .map((l) => {
      const overlap = l.matchTags.filter((t) => tags.has(t)).length;
      return overlap > 0 ? { item: l, score: overlap, priority: l.priority ?? 0 } : null;
    })
    .filter((x): x is Scored<(typeof linkTargets)[number]> => x !== null);
  const rankedLinks = rank(scoredLinks).slice(0, resultSizing.linksMax);

  // --- Assemble ---
  const resultPlants = selectedPlants.map((p) => ({
    name: p.name,
    botanical: p.botanical,
    note: p.note,
  }));
  const resultFeatures = selectedFeatures.map((f) => ({
    name: f.name,
    note: f.note,
    link: f.link ? resolveLandartUrl(f.link) : undefined,
  }));

  return {
    style: {
      id: style.id,
      name: style.name,
      summary: style.summary,
      materials: style.materials,
    },
    image: { src: image.file, alt: image.alt },
    plants: resultPlants,
    features: resultFeatures,
    maintenanceNote: maintenanceNote(selectedPlants, selectedFeatures, tags),
    links: rankedLinks.map((s) => ({
      label: s.item.label,
      url: resolveLandartUrl(s.item.url),
      kind: s.item.kind,
    })),
    teaser: {
      styleName: style.name,
      summaryLine: style.summary.split(". ")[0] + ".",
      headlineItems: [
        resultPlants[0]?.name,
        resultFeatures[0]?.name,
        resultPlants[1]?.name,
      ].filter((x): x is string => Boolean(x)),
    },
  };
}
