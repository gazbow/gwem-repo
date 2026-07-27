"use client";

import type { GuideResult } from "@/lib/types";
import { GardenHero } from "@/components/GardenHero";

// The teaser shown before capture: style name, a summary line, and 2-3 headline items,
// with the rest gated behind the form (Build Spec section 3, step 4).
export function ResultPreview({ result }: { result: GuideResult }) {
  return (
    <div className="bg-surface border border-hairline">
      <GardenHero
        src={result.image.src}
        alt={result.image.alt}
        priority
        className="h-48 sm:h-64"
      />
      <div className="bg-charcoal text-surface p-6 sm:p-8">
        <p className="label-eyebrow">Your concept direction</p>
        <h2 className="font-display text-4xl sm:text-5xl mt-2 text-surface">
          {result.teaser.styleName}
        </h2>
        <p className="mt-3 text-page/90 max-w-xl">{result.teaser.summaryLine}</p>
      </div>

      <div className="p-6 sm:p-8">
        <p className="label-eyebrow">A taste of what&rsquo;s inside</p>
        <ul className="mt-4 space-y-2">
          {result.teaser.headlineItems.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-gold shrink-0" aria-hidden />
              <span className="text-charcoal">{item}</span>
            </li>
          ))}
        </ul>

        {/* Gated / blurred remainder */}
        <div className="mt-6 relative" aria-hidden>
          <div className="space-y-2 blur-sm select-none">
            <div className="h-4 bg-hairline w-3/4" />
            <div className="h-4 bg-hairline w-2/3" />
            <div className="h-4 bg-hairline w-5/6" />
            <div className="h-4 bg-hairline w-1/2" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="label-eyebrow bg-surface/80 px-3 py-1">
              Full palette, features &amp; upkeep below
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
