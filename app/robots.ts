// app/robots.ts
// Search engine crawling rules
// Allows public pages, blocks admin and auth pages

import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: "https://emmanuel-abolade.vercel.app/sitemap.xml",
  }
}