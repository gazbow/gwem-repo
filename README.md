# Landart Interactive Garden Guide

A self-contained web app that asks a visitor a short set of questions about their
outdoor space and returns a tailored garden concept direction, capturing the visitor's
details in exchange for a designed PDF of their result.

Built for Sydney only — Eastern Suburbs and Northern Beaches. All content, plant choices
and copy reflect Sydney and coastal Sydney conditions.

Deploys to a Landart subdomain (e.g. `guide.landart.com.au`) for testing and refinement.

## Tech stack

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS** with the Landart brand tokens set as theme values (`tailwind.config.ts`)
- **Content in editable data files** (`src/data/*`) — questions, plants, features, style
  profiles and link targets. No component edits needed to change content. See `CONTENT.md`.
- **One serverless route** (`/api/submit`) doing server-side result generation, PDF
  creation, email send and lead storage.
- **PDF** via `@react-pdf/renderer` (no headless browser).
- **Email** via [Resend](https://resend.com) (swap for SMTP/Nodemailer if preferred).
- **Lead storage** behind a single `saveLead()` function — console (default),
  Google Sheets or Airtable, swappable for a CRM later.
- **Analytics**: GA4 events.

## Local setup

```bash
npm install
cp .env.example .env.local   # optional — the app runs without any secrets
npm run dev                  # http://localhost:3000
```

The guide works end to end with no configuration: email and lead storage degrade
gracefully (storage logs to the console, email is skipped) and the on-screen result
still shows. Add secrets to enable real email and storage.

### Scripts

| Command          | Does                                             |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Local dev server                                 |
| `npm run build`  | Production build                                 |
| `npm run start`  | Serve the production build                       |
| `npm test`       | Run the recommendation-engine unit tests (Vitest)|
| `npm run lint`   | ESLint                                           |

## Environment variables

All optional for local dev; set the real values in Vercel for production. See
`.env.example` for the full annotated list. Highlights:

| Variable                          | Purpose                                             |
| --------------------------------- | --------------------------------------------------- |
| `RESEND_API_KEY`, `EMAIL_FROM`    | Send the result PDF by email                        |
| `LEAD_NOTIFY_EMAIL`               | Internal new-lead alert                             |
| `LEAD_STORAGE`                    | `console` \| `google-sheets` \| `airtable`          |
| `GOOGLE_SHEETS_WEBHOOK_URL`       | Apps Script endpoint that appends a row             |
| `AIRTABLE_API_KEY` / `_BASE_ID`   | Airtable storage                                    |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID`  | GA4 property (align with the Landart site property) |
| `NEXT_PUBLIC_SITE_URL`            | Public base URL (canonical/OG, PDF links)           |
| `NEXT_PUBLIC_LANDART_URL`         | Live Landart site (result links, consult CTA)       |
| `NEXT_PUBLIC_PRIVACY_URL`         | Privacy policy linked by the consent checkbox       |

Never commit secrets. `.env*.local` is git-ignored.

## How it fits together

```
src/
  app/
    layout.tsx            Root layout, fonts (Montserrat + Cormorant fallback), GA4
    page.tsx              Landing view (SSR) + JSON-LD + links to example results
    guide/[slug]/page.tsx Pre-built, indexable example result pages (SEO)
    api/submit/route.ts   Validate → re-run engine → PDF → email → saveLead → notify
    sitemap.ts, robots.ts
  components/             Guide flow (stepper, tiles, preview, capture, full result)
  data/                   EDITABLE CONTENT — see CONTENT.md
  lib/
    engine.ts             Rules-based recommendation engine (+ engine.test.ts)
    pdf.tsx               Branded result PDF
    email.ts              Resend delivery + internal notification
    saveLead.ts           Swappable storage adapter
    validation.ts         Server-side zod schema + honeypot
    analytics.ts          GA4 event helpers
    seoCombos.ts          The example combinations behind /guide/[slug]
```

## Deployment (Vercel)

1. Import the repo into Vercel.
2. Add the environment variables above (Project Settings → Environment Variables).
3. Deploy. Vercel builds and hosts automatically.
4. Add the custom domain (`guide.landart.com.au`) in Vercel and create the matching
   **CNAME** record with Landart's DNS host, pointing at Vercel.

**Promote a preview to production:** every push builds a preview deployment. Promote it
from the Vercel dashboard (Deployments → ⋯ → Promote to Production), or merge to the
production branch to trigger a production build.

## Testing

- `npm test` runs the engine suite: a coastal sandy full-sun brief, a shaded courtyard
  retreat, a family garden with young children (asserts unsafe plants are excluded),
  and large modern grounds with a lap pool — plus a sweep asserting **no answer
  combination dead-ends**.
- Manual pass: complete the guide on a phone and a desktop, confirm the email arrives
  and the PDF renders, and verify GA4 events fire in order (`guide_start`,
  `guide_step`, `guide_complete`, `lead_capture`, `result_link_click`,
  `consult_cta_click`).

## Notes

- **Brand rules are enforced:** square corners everywhere, flat surfaces (no shadows or
  gradients), charcoal + gold, Montserrat body. `ivyora-display` is Adobe-licensed and
  not bundled; Cormorant is the approved placeholder serif until it's wired in.
- Confirm the Landart result/link URLs in `src/data/linkTargets.ts` against the live
  site before launch.
