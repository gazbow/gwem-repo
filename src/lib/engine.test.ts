import { describe, it, expect } from "vitest";
import { generateResult, collectTags } from "@/lib/engine";
import { budgetBandsFor } from "@/data/config";
import { questions } from "@/data/questions";
import { plants } from "@/data/plants";
import type { Answers } from "@/lib/types";

// Representative answer sets (Build Spec section 13).

const coastalSandyFullSunEntertaining: Answers = {
  size: ["mid"],
  sun: ["full"],
  site: ["coastal"],
  use: ["entertain"],
  who: ["adults"],
  style: ["native"],
};

const shadedCourtyardRetreat: Answers = {
  size: ["courtyard"],
  sun: ["shade"],
  site: ["inland"],
  use: ["retreat"],
  who: ["adults"],
  style: ["lush"],
};

const familyGardenYoungChildren: Answers = {
  size: ["mid"],
  sun: ["full"],
  site: ["inland"],
  use: ["family"],
  who: ["children", "pets"],
  style: ["lush"],
};

const largeModernLapPool: Answers = {
  size: ["large"],
  sun: ["full"],
  site: ["inland"],
  use: ["pool", "entertain"],
  who: ["adults"],
  style: ["modern"],
};

// Names of every plant flagged unsafe around young children.
const unsafeForChildren = new Set(
  plants.filter((p) => p.avoid?.includes("who:children")).map((p) => p.name),
);

describe("recommendation engine", () => {
  it("coastal sandy full-sun entertaining brief → coastal natives + entertaining features", () => {
    const r = generateResult(coastalSandyFullSunEntertaining);
    expect(r.style.name).toBe("Natural and native");
    expect(r.plants.length).toBeGreaterThanOrEqual(5);
    // Coastal Rosemary requires sun:full and prefers sandy + coastal + native — should surface high.
    const names = r.plants.map((p) => p.name);
    expect(names).toContain("Coastal Rosemary");
    // Frangipani is fine here (no children).
    expect(names).toContain("Frangipani");
  });

  it("shaded courtyard retreat → shade-tolerant palette, no full-sun-only plants", () => {
    const r = generateResult(shadedCourtyardRetreat);
    const names = r.plants.map((p) => p.name);
    expect(r.plants.length).toBeGreaterThanOrEqual(5);
    // Full-sun-only plants must not appear in a shaded result.
    expect(names).not.toContain("Coastal Rosemary");
    expect(names).not.toContain("Frangipani");
    expect(names).not.toContain("Kangaroo Paw");
    // At least one genuinely shade-loving plant should be present.
    const shadeLovers = ["Soft Tree Fern", "Bird's Nest Fern", "Clivia", "Native Violet"];
    expect(names.some((n) => shadeLovers.includes(n))).toBe(true);
  });

  it("family garden with young children → excludes every plant flagged unsafe for children", () => {
    const r = generateResult(familyGardenYoungChildren);
    const names = r.plants.map((p) => p.name);
    for (const unsafe of unsafeForChildren) {
      expect(names).not.toContain(unsafe);
    }
    // Sanity: we actually have some flagged plants, so this test has teeth.
    expect(unsafeForChildren.size).toBeGreaterThan(0);
    expect(r.plants.length).toBeGreaterThanOrEqual(5);
    // A children's lawn should be a natural feature suggestion here.
    expect(r.features.map((f) => f.name)).toContain("Children's lawn");
  });

  it("large modern grounds with a lap pool → lap pool surfaces, style is modern", () => {
    const r = generateResult(largeModernLapPool);
    expect(r.style.name).toBe("Structured and modern");
    expect(r.features.map((f) => f.name)).toContain("Lap pool");
    expect(r.features.length).toBeGreaterThanOrEqual(3);
  });

  it("lap pool is gated out of a small courtyard (requiresSize: size:large)", () => {
    const r = generateResult({ ...largeModernLapPool, size: ["courtyard"] });
    expect(r.features.map((f) => f.name)).not.toContain("Lap pool");
  });

  it("every single-choice answer combination produces a non-empty, sensible result (no dead ends)", () => {
    const single = (id: string) => questions.find((q) => q.id === id)!;
    let combos = 0;
    for (const size of single("size").options)
      for (const sun of single("sun").options)
        for (const site of single("site").options)
          for (const style of single("style").options) {
            // Hardest case for exclusions: young children AND pets present.
            const answers: Answers = {
              size: [size.id],
              sun: [sun.id],
              site: [site.id],
              use: ["family"],
              who: ["children", "pets"],
              style: [style.id],
            };
            const r = generateResult(answers);
            expect(r.plants.length).toBeGreaterThanOrEqual(5);
            expect(r.features.length).toBeGreaterThanOrEqual(3);
            expect(r.style.name.length).toBeGreaterThan(0);
            expect(r.links.length).toBeGreaterThan(0);
            combos++;
          }
    expect(combos).toBe(4 * 3 * 4 * 3);
  });

  it("'Landart to maintain it' → maintenance note offers the managed plan and surfaces the maintenance page", () => {
    const r = generateResult({
      ...largeModernLapPool,
      maint: ["low", "managed"],
    });
    expect(r.maintenanceNote.toLowerCase()).toContain("maintenance plan");
    expect(r.links.some((l) => l.url.includes("garden-maintenance"))).toBe(true);
  });

  it("budget bands adapt to the answers (compact courtyard vs large grounds with a pool)", () => {
    const compact = budgetBandsFor(collectTags(shadedCourtyardRetreat));
    expect(compact[0]).toBe("Under $5,000");
    expect(compact).not.toContain("$250,000+");

    const premium = budgetBandsFor(collectTags(largeModernLapPool)); // large + pool
    expect(premium).toContain("$250,000+");
    expect(premium[0]).toBe("$25,000 – $75,000");

    // A mid-size garden sits in between — no sub-$5k, no $250k+.
    const mid = budgetBandsFor(collectTags(familyGardenYoungChildren));
    expect(mid).not.toContain("Under $5,000");
    expect(mid).not.toContain("$250,000+");
  });

  it("collectTags gathers every tag from multi-select answers", () => {
    const tags = collectTags(largeModernLapPool);
    expect(tags.has("use:pool")).toBe(true);
    expect(tags.has("use:entertain")).toBe(true);
    expect(tags.has("style:modern")).toBe(true);
    expect(tags.has("size:large")).toBe(true);
  });
});
