import { fileURLToPath, URL } from "node:url";

import { defineConfig, type UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const settings: UserConfigExport = {
    plugins: [vue()],
    base: "./",
    esbuild: {
      drop: process.env.NODE_ENV === "production" ? ["console"] : undefined,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
  if (command === "serve") {
    settings.plugins?.push({
      name: "HMRtweak",
      handleHotUpdate({ modules }) {
        modules.forEach((module) => {
          module.importers.clear();
        });
        return modules;
      },
    });
  }
  return settings;
});
