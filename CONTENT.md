# Editing the guide's content

All the content a non-developer might change lives in typed data files under
`src/data/`. You can edit questions, plants, features, styles and links without
touching any component code. After editing, run `npm run build` (or redeploy) to
publish. If you have Node installed, `npm test` checks the engine still behaves.

Everything is driven by **tags**. A tag is a short label like `sun:full`,
`soil:sandy`, `coastal`, `style:modern` or `who:children`. Answers add tags to a
visitor's "answer set"; plants, features and links are matched against that set.

---

## The files

| File                      | What it holds                                              |
| ------------------------- | ---------------------------------------------------------- |
| `src/data/questions.ts`   | The questions, their options, and the tags each option adds |
| `src/data/plants.ts`      | The plant palette                                          |
| `src/data/features.ts`    | Suggested features (pool, fire pit, lighting, …)           |
| `src/data/styleProfiles.ts` | The three style write-ups (lush, modern, native)         |
| `src/data/linkTargets.ts` | Links to Landart pages, articles and projects              |
| `src/data/config.ts`      | Scoring weights, how many results to show, site URLs       |
| `src/lib/seoCombos.ts`    | The example result pages at `/guide/…` (for SEO)           |

---

## How tags drive the result

1. The visitor's answers are turned into a set of tags.
2. **Disqualify:** any item whose `requires` (or `requiresSize`) tags aren't all
   present is dropped. Any item with an `avoid` tag that _is_ present is dropped
   (this is how unsafe-around-children plants are excluded).
3. **Score:** `+2` for each matched `requires` tag, `+1` for each matched `prefers`
   tag. (Weights live in `src/data/config.ts`.)
4. The top plants (5–8) and features (3–5) are shown, highest score first, with a
   curated `priority` number breaking ties.
5. The **style** comes straight from the visitor's `style:*` answer.
6. The **maintenance note** is derived from how hands-on the chosen plants and
   features are.
7. **Links** whose `matchTags` overlap the answer set are shown (up to three).

---

## Adding a plant

Append an entry to the array in `src/data/plants.ts`:

```ts
{
  id: "coastal-banksia",          // unique, lowercase-with-dashes
  name: "Coastal Banksia",        // common name shown to the visitor
  botanical: "Banksia integrifolia",
  note: "A local coastal tree that shrugs off salt wind and brings in the birds.",
  requires: ["sun:full"],         // MUST all be present, or the plant is hidden
  prefers: ["soil:sandy", "coastal", "style:native"], // nudges it up the list
  avoid: ["who:children"],        // OPTIONAL — hides it when this tag is present
  maintenance: "low",             // "low" | "balanced" | "high"
  priority: 7,                    // OPTIONAL tiebreak, higher wins
},
```

Tagging tips:

- Keep `requires` light. Use it only for a genuine deal-breaker (e.g. a full-sun
  plant that fails in shade → `requires: ["sun:full"]`). Everything else goes in
  `prefers`. This keeps results rich and avoids dead ends.
- Put soil and coastal tolerance in `prefers` unless the plant truly won't grow
  otherwise.
- **Safety:** if a plant is toxic or unsafe around young children, add
  `avoid: ["who:children"]` (and `"who:pets"` if relevant). This is deliberate —
  don't remove these flags without horticultural sign-off.

### The available tags

| Group   | Tags                                              |
| ------- | ------------------------------------------------- |
| size    | `size:small`, `size:medium`, `size:large`, `exposed` |
| sun     | `sun:full`, `sun:part`, `sun:shade`               |
| soil    | `soil:sandy`, `soil:loam`, `soil:clay`, `soil:unknown` |
| coastal | `coastal`                                         |
| use     | `use:entertain`, `use:family`, `use:pool`, `use:retreat`, `use:kitchen` |
| who     | `who:children`, `who:pets`, `who:adults`          |
| style   | `style:lush`, `style:modern`, `style:native`      |
| maint   | `maint:low`, `maint:balanced`, `maint:high` (optional Q7) |

---

## Adding a feature

Same idea, in `src/data/features.ts`. Features can gate on site size:

```ts
{
  id: "lap-pool",
  name: "Lap pool",
  note: "A long, lean pool for swimming laps.",
  prefers: ["use:pool", "style:modern"],
  requiresSize: ["size:large"],   // only offered on large sites
  avoid: ["size:small"],          // or exclude specific sizes
  link: "/services/garden-design-sydney", // OPTIONAL Landart page
  maintenance: "balanced",
  priority: 7,
},
```

> **Note:** `requires` / `requiresSize` mean **all** listed tags must be present.
> To say "medium **or** large", don't list both — instead exclude what you don't
> want with `avoid: ["size:small"]`.

---

## Editing the styles

`src/data/styleProfiles.ts` holds the three write-ups. Keep the `id` matching the
style tag (`style:lush`, `style:modern`, `style:native`). Edit `summary` and
`materials` freely — they appear in the result header and the PDF.

---

## Editing the links

`src/data/linkTargets.ts` maps to real Landart pages. A link is offered when **any**
of its `matchTags` is in the answer set. Set `kind` to `service`, `article` or
`project`. Use site-relative paths (`/plunge-pools`) — they resolve to the live
Landart site automatically. **Confirm final URLs against the live site before
launch.**

---

## Adding a seventh question (maintenance)

A maintenance question is scaffolded (commented out) at the bottom of
`src/data/questions.ts`. Uncomment it to switch it on — its answers carry
`maint:low|balanced|high`, and the engine already reads them. No code changes needed.

---

## Adding an example (SEO) page

`src/lib/seoCombos.ts` lists the pre-built example results shown at `/guide/<slug>`.
Add an entry with a `slug`, `title`, `intro` and a set of `answers` and a new
indexable page is generated on the next build.
