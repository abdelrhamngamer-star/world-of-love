export const site = {
  name: "A World of Love",
  title: "A World of Love | عالم صغير من الحب",
  tagline: "A little world made of love, care, and endless feelings.",
  description: "فيه كلام بيتقال، ومشاعر بتتحكي، وتفاصيل صغيرة بتخلي العالم أجمل. اكتشفي عالمك.",
  // Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://your-domain.vercel.app)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.vercel.app",
  ogImage: "/og-cover.png",
  ogAlt: "A World of Love — عالم صغير من الحب",
  audio: "/audio/ambient.mp3", // optional: drop a file here, site works without it
  kissSound: "", // optional: e.g. "/audio/kiss.mp3"; empty = built-in synthesized kiss sound
};
