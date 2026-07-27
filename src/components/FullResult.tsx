"use client";

import type { GuideResult } from "@/lib/types";
import { analytics } from "@/lib/analytics";
import { GardenHero } from "@/components/GardenHero";
import { site } from "@/data/config";

// The complete on-screen concept (Build Spec sections 3 & 7): style, palette, features,
// upkeep, matching Landart work, and a consult invitation. Reused by the SEO pages.

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-eyebrow">{children}</p>;
}

export function FullResult({ result }: { result: GuideResult }) {
  return (
    <div className="space-y-12">
      {/* Hero image (tag-matched) */}
      <GardenHero
        src={result.image.src}
        alt={result.image.alt}
        priority
        className="h-56 sm:h-80"
      />

      {/* Style header */}
      <header className="bg-charcoal text-surface p-6 sm:p-10">
        <SectionLabel>Your concept direction</SectionLabel>
        <h1 className="font-display text-4xl sm:text-6xl mt-3 text-surface">
          {result.style.name}
        </h1>
        <p className="mt-4 text-page/90 max-w-2xl leading-relaxed">
          {result.style.summary}
        </p>
        <p className="mt-4 text-page/70 text-sm max-w-2xl">
          <span className="text-gold uppercase tracking-label text-xs">
            Materials &amp; palette&nbsp;&nbsp;
          </span>
          {result.style.materials}
        </p>
      </header>

      {/* Planting palette */}
      <section>
        <SectionLabel>Planting palette</SectionLabel>
        <div className="mt-4 border-t border-hairline">
          {result.plants.map((p) => (
            <div key={p.name} className="border-b border-hairline py-4">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="font-medium text-lg text-charcoal">{p.name}</h3>
                <span className="text-sm text-muted italic">{p.botanical}</span>
              </div>
              <p className="text-muted mt-1">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested features */}
      <section>
        <SectionLabel>Suggested features</SectionLabel>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.features.map((f) => (
            <div key={f.name} className="border border-hairline bg-surface p-5">
              <h3 className="font-medium text-charcoal">{f.name}</h3>
              <p className="text-sm text-muted mt-1">{f.note}</p>
              {f.link ? (
                <a
                  href={f.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.resultLinkClick(f.link!, "feature")}
                  className="inline-block mt-3 text-sm text-charcoal underline hover:text-gold"
                >
                  See how we build it
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Maintenance note */}
      <section>
        <SectionLabel>On upkeep</SectionLabel>
        <div className="mt-4 bg-panel border-l-2 border-gold p-6">
          <p className="text-charcoal leading-relaxed">{result.maintenanceNote}</p>
        </div>
      </section>

      {/* Matching Landart work + reading */}
      {result.links.length > 0 ? (
        <section>
          <SectionLabel>See it in our work</SectionLabel>
          <ul className="mt-4 divide-y divide-hairline border-t border-hairline">
            {result.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.resultLinkClick(l.url, l.kind)}
                  className="flex items-center justify-between py-4 group"
                >
                  <span className="text-charcoal group-hover:text-gold transition-colors">
                    {l.label}
                  </span>
                  <span className="label-eyebrow">{l.kind}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Consult CTA */}
      <section className="bg-gold p-6 sm:p-10 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal">
          Let&rsquo;s make it real
        </h2>
        <p className="mt-3 text-charcoal/80 max-w-xl mx-auto">
          This is the opening of a design conversation. Book a consult and we&rsquo;ll
          turn your concept into a garden built for your space.
        </p>
        <a
          href={site.contactUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analytics.consultCtaClick("full_result")}
          className="btn-primary mt-6"
        >
          Book a consult
        </a>
      </section>
    </div>
  );
}
