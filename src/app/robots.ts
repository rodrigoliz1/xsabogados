import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { isVercelPreview } from "@/lib/environment";

export default function robots(): MetadataRoute.Robots {
  if (isVercelPreview()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      host: siteConfig.url,
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/admin/",
        "/portal/panel",
        "/portal/panel/",
        "/portal/iniciar-sesion",
        "/portal/recuperar",
        "/portal/restablecer",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
