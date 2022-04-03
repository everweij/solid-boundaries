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
    dir: "./src",
    environment: "jsdom",
    globals: false,
    transformMode: {
      web: [/\.tsx?$/]
    },
    deps: {
      inline: [/solid-js/]
    },
    threads: true,
    isolate: true
  },

  resolve: {
    conditions: ["development", "browser"]
  }
});
