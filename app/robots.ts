import type { MetadataRoute } from "next";
// Crawling stays allowed so link-preview bots (WhatsApp) can read the metadata;
// the page itself carries <meta name="robots" content="noindex, nofollow">.
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" } }; }
