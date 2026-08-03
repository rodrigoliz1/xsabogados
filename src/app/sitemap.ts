import type { MetadataRoute } from "next";

import { articles } from "@/data/articles";
import { lawyers } from "@/data/lawyers";
import { practiceAreas } from "@/data/practice-areas";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/firma",
    "/equipo",
    "/areas",
    "/insights",
    "/agenda",
    "/contacto",
    "/portal",
    "/aviso-de-privacidad",
    "/terminos",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority:
        path === "" ? 1 : path === "/areas" || path === "/equipo" ? 0.85 : 0.7,
    })),
    ...practiceAreas.map((area) => ({
      url: `${siteConfig.url}/areas/${area.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...lawyers.map((lawyer) => ({
      url: `${siteConfig.url}/equipo/${lawyer.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${siteConfig.url}/insights/${article.slug}`,
      lastModified: new Date(`${article.publishedAt}T12:00:00.000Z`),
      changeFrequency: "yearly" as const,
      priority: 0.65,
    })),
  ];
}
