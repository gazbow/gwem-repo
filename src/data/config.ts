// Tunable configuration for the recommendation engine and result sizing.
// Everything a non-developer might adjust during testing lives here (Build Spec section 8).

export const scoring = {
  // Points awarded per matched tag when scoring plants and features.
  requiresMatch: 2, // +2 for each matched `requires` / `requiresSize` tag
  prefersMatch: 1, // +1 for each matched `prefers` tag
} as const;

// Optional budget bands offered on the capture form. Edit freely — the form and the
// server-side validation both read this list, so they stay in sync.
export const budgetOptions = [
  "Under $50,000",
  "$50,000 – $150,000",
  "$150,000 – $350,000",
  "$350,000+",
  "Not sure yet",
] as const;

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
