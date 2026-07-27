import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCombo, seoCombos } from "@/lib/seoCombos";
import { generateResult } from "@/lib/engine";
import { FullResult } from "@/components/FullResult";
import { Logo } from "@/components/Logo";
import { site } from "@/data/config";

// Pre-built, indexable result-style pages (Build Spec section 11). Statically generated
// so search and AI tools get clean text, with FAQ-style JSON-LD.

export const dynamicParams = false;

export function generateStaticParams() {
  return seoCombos.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const combo = getCombo(params.slug);
  if (!combo) return {};
  return {
    title: combo.title,
    description: combo.intro,
    alternates: { canonical: `${site.siteUrl}/guide/${combo.slug}` },
    openGraph: {
      title: combo.title,
      description: combo.intro,
      url: `${site.siteUrl}/guide/${combo.slug}`,
      type: "article",
    },
  };
}

export default function SeoResultPage({ params }: { params: { slug: string } }) {
  const combo = getCombo(params.slug);
  if (!combo) notFound();

  const result = generateResult(combo.answers);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What plants suit ${combo.title.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A suggested palette includes ${result.plants
            .map((p) => `${p.name} (${p.botanical})`)
            .join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: "What features work well in this kind of garden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: result.features.map((f) => f.name).join(", ") + ".",
        },
      },
      {
        "@type": "Question",
        name: "How much maintenance does it need?",
        acceptedAnswer: { "@type": "Answer", text: result.maintenanceNote },
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <div className="border-b border-hairline bg-page">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Landart home">
            <Logo height={30} />
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-label text-muted hover:text-cream"
          >
            Build your own
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <p className="text-muted mb-8 max-w-2xl">{combo.intro}</p>
        <FullResult result={result} />

        <div className="mt-12 border-t border-hairline pt-8 text-center">
          <p className="text-muted">This is one example. Yours will be different.</p>
          <Link href="/" className="btn-primary mt-4">
            Build my own concept
          </Link>
        </div>
      </div>
    </main>
  );
}
