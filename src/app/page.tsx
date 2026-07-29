import { Guide } from "@/components/Guide";
import { site } from "@/data/config";
import { seoCombos } from "@/lib/seoCombos";

// Landing view is server-rendered (Build Spec section 11): the app shell and JSON-LD
// are in the initial HTML; the interactive stepper hydrates on top.

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Landart Garden Guide",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: site.siteUrl,
    description:
      "A short interactive guide that returns a tailored garden concept direction for Sydney's Eastern Suburbs and Northern Beaches.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    provider: {
      "@type": "Organization",
      name: "Landart",
      areaServed: "Sydney, Australia",
      url: site.landartUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Guide />

      {/* Indexable text for search / AI, linking the pre-built example results.
          Visually quiet, but real crawlable content (Build Spec section 11). */}
      <section className="border-t border-hairline bg-page">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <p className="label-eyebrow">Example concepts</p>
          <h2 className="font-display text-2xl mt-2 text-cream">
            A few Sydney gardens the guide has shaped
          </h2>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {seoCombos.map((c) => (
              <li key={c.slug}>
                <a
                  href={`/guide/${c.slug}`}
                  className="block border border-hairline bg-surface px-4 py-3 hover:border-gold transition-colors"
                >
                  <span className="text-cream">{c.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
