// Tunable configuration for the recommendation engine and result sizing.
// Everything a non-developer might adjust during testing lives here (Build Spec section 8).

export const scoring = {
  // Points awarded per matched tag when scoring plants and features.
  requiresMatch: 2, // +2 for each matched `requires` / `requiresSize` tag
  prefersMatch: 1, // +1 for each matched `prefers` tag
} as const;

// Dynamic budget bands (optional field on the capture form). The bands shown adapt to
// the visitor's answers, since a courtyard refresh and large grounds with a pool sit in
// very different ranges. Edit the tiers freely — the form and server-side validation both
// read from here, so they stay in sync.
export const budgetTiers = {
  // Compact sites (courtyard / balcony / rooftop), no pool.
  compact: ["Under $5,000", "$5,000 – $15,000", "$15,000 – $30,000", "$30,000+"],
  // Mid-size gardens, or compact sites with a pool.
  modest: ["$10,000 – $25,000", "$25,000 – $50,000", "$50,000 – $75,000", "$75,000+"],
  // Large grounds, or mid-size gardens with a pool.
  substantial: ["$20,000 – $50,000", "$50,000 – $100,000", "$100,000 – $150,000", "$150,000+"],
  // Large grounds with a pool, or gardens delivered alongside a build/renovation.
  premium: ["$25,000 – $75,000", "$75,000 – $150,000", "$150,000 – $250,000", "$250,000+"],
} as const;

// Superset of every band, for server-side validation (the client only ever shows a subset).
export const allBudgetOptions = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000+",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000 – $75,000",
  "$75,000+",
  "$20,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000 – $150,000",
  "$150,000+",
  "$25,000 – $75,000",
  "$75,000 – $150,000",
  "$150,000 – $250,000",
  "$250,000+",
] as const;

// Choose the band set from the visitor's answer tags (size is the main driver;
// a pool and a build/reno push the range up).
export function budgetBandsFor(tags: Set<string>): readonly string[] {
  let score = 0;
  if (tags.has("size:medium")) score += 1;
  if (tags.has("size:large")) score += 2;
  if (tags.has("use:pool")) score += 1;
  if (tags.has("stage:build")) score += 1;

  if (score <= 0) return budgetTiers.compact;
  if (score === 1) return budgetTiers.modest;
  if (score === 2) return budgetTiers.substantial;
  return budgetTiers.premium;
}

export const resultSizing = {
  plantsMin: 5,
  plantsMax: 8,
  featuresMin: 3,
  featuresMax: 5,
  linksMax: 3,
} as const;

// Site-wide URLs. Read from env at runtime where possible; these are the fallbacks
// so the app builds and renders sensibly with nothing configured.
export const site = {
  landartUrl:
    process.env.NEXT_PUBLIC_LANDART_URL?.replace(/\/$/, "") ??
    "https://landart.com.au",
  // Where every "Book a consult" action points.
  contactUrl:
    process.env.NEXT_PUBLIC_LANDART_CONTACT_URL ?? "https://landart.com.au/contact/",
  privacyUrl:
    process.env.NEXT_PUBLIC_PRIVACY_URL ?? "https://landart.com.au/privacy-policy/",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://guide.landart.com.au",
} as const;

// Resolve a link that may be a site-relative path ("/plunge-pools") into an
// absolute URL against the live Landart site.
export function resolveLandartUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${site.landartUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
