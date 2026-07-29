import type { MetadataRoute } from "next";
import { seoCombos } from "@/lib/seoCombos";
import { site } from "@/data/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...seoCombos.map((c) => ({
      url: `${site.siteUrl}/guide/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
