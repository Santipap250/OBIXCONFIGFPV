import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolRoutes,
  ];
}
