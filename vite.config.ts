import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.js",
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "icons/*.png"],
        injectManifest: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        },
        manifest: {
          name: "nori",
          short_name: "nori",
          description: "Secure Matrix messaging for the web.",
          start_url: "/",
          display: "standalone",
          background_color: "#0f172a",
          theme_color: "#0f172a",
          lang: "en",
          icons: [
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_CONTACTS_SERVER,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
