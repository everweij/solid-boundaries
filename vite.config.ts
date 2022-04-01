/// <reference types="vitest" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";
import typescript from "rollup-plugin-typescript2";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      formats: ["cjs", "es"],
      entry: path.resolve(__dirname, "src/index.tsx"),
      fileName: format => `solid-boundaries.${format}.js`
    },
    rollupOptions: {
      treeshake: true,
      external: ["solid-js"],
      plugins: [
        typescript({
          check: true,
          tsconfig: path.resolve(__dirname, "tsconfig.json"),
          tsconfigOverride: {
            declarationOnly: true,
            declaration: true,
            exclude: ["**/*.test.tsx", "**/*.test.ts"]
          }
        })
      ]
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
