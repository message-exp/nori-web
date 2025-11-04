import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const pwaOptions: Partial<VitePWAOptions> = {
  strategies: "injectManifest",
  srcDir: "src",
  filename: "sw.ts",
  registerType: "prompt",
  injectRegister: false,

  pwaAssets: {
    disabled: false,
    config: true,
  },

  manifest: {
    name: "nori-web",
    short_name: "nori-web",
    description: "Your messaging space",
    theme_color: "#f4eedb",
  },

  injectManifest: {
    globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
  },

  devOptions: {
    enabled: false,
    type: "module",
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      // react() as unknown as PluginOption,
      tailwindcss() as unknown as PluginOption,
      reactRouter() as unknown as PluginOption,
      tsconfigPaths() as unknown as PluginOption,
      VitePWA(pwaOptions) as unknown as PluginOption,
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
