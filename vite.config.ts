import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon-32.png", "apple-touch-icon.png", "media/*.webp", "media/spell/v3/*"],
      manifest: {
        name: "Funkschein-Trainer",
        short_name: "Funkschein",
        description: "UBI & SRC lernen: Kurs, amtliche Fragen, Prüfungsbögen, Funkgerät IC-M423 und Funk-Simulator.",
        lang: "de",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "any",
        theme_color: "#0B2F4D",
        background_color: "#0B2F4D",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webp,mp3,json,webmanifest}"],
        maximumFileSizeToCacheInBytes: 5000000,
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        cacheId: "funkschein-trainer-v3",
      },
    }),
  ],
});
