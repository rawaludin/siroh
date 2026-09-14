import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  site: "https://rawaludin.github.io",
  base: "/siroh/",
  server: { host: true },
  preview: { host: true },
  integrations: [
    mdx(),
    AstroPWA({
      registerType: "autoUpdate",
      base: "/siroh/",
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
        start_url: "/siroh/",
        scope: "/siroh/",
        icons: [
          { src: "icons/pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png}"],
        manifestTransforms: [
          (entries) => ({
            manifest: entries.map((e) => {
              let url = e.url.replace(/index\.html$/, "");
              if (url === "" || url === "index.html") url = "./";
              if (!/\.[a-z0-9]+$/i.test(url) && !url.endsWith("/")) url += "/";
              return { ...e, url };
            }),
            warnings: [],
          }),
        ],
      },
      pwaAssets: { image: "public/icons/icon.svg" },
    }),
  ],
});
