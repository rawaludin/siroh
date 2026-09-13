import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  server: { host: true },
  preview: { host: true },
  integrations: [
    mdx(),
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Sirah Nabawiyah",
        short_name: "Sirah",
        description:
          "Garis waktu interaktif kehidupan Nabi Muhammad ﷺ untuk anak-anak.",
        lang: "id",
        theme_color: "#ff6b35",
        background_color: "#fff9e6",
        display: "standalone",
        start_url: "/",
      },
      pwaAssets: { image: "public/icons/icon.svg" },
    }),
  ],
});
