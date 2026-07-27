import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat, Cormorant } from "next/font/google";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { site } from "@/data/config";
import "./globals.css";

// Body / UI font (Build Spec section 4). Self-hosted by next/font — no third-party request.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// Display fallback. ivyora-display is Adobe-hosted and licensed; Cormorant is the
// approved placeholder serif until the licensed font is wired in (Build Spec section 4).
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Landart Garden Guide — Your Sydney Garden Concept in Two Minutes",
    template: "%s — Landart Garden Guide",
  },
  description:
    "Answer a few quick questions about your outdoor space and get a tailored garden concept direction for Sydney's Eastern Suburbs and Northern Beaches — planting, features and style, free.",
  openGraph: {
    title: "Landart Garden Guide",
    description:
      "A tailored Sydney garden concept in under two minutes — planting, features and style.",
    url: site.siteUrl,
    siteName: "Landart",
    locale: "en_AU",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body>
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
