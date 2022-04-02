/// <reference types="vitest" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      formats: ["cjs", "es"],
      entry: path.resolve(__dirname, "src/index.ts")
    },
    rollupOptions: {
      treeshake: true,
      external: ["solid-js"],
      input: {
        index: path.resolve(__dirname, "src/index.ts"),
        server: path.resolve(__dirname, "src/server.ts")
      },
      output: {
        entryFileNames: () => "[name].[format].js"
      }
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./setup-vitest.ts",
    globals: true,
    transformMode: {
      web: [/\.tsx?$/]
    },
    deps: {
      inline: [/solid-js/]
    },
    threads: false,
    isolate: false
  },

  resolve: {
    conditions: ["development", "browser"]
  }
});
