export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://obixconfigfpv.onrender.com";

export const siteHost = siteUrl.replace(/^https?:\/\//, "");
