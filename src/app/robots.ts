// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/", "/admin/", "/_next/", "/static/"],
    },
    sitemap: "https://moshiurrahman.online/sitemap.xml",
    host: "https://moshiurrahman.online",
  };
}
