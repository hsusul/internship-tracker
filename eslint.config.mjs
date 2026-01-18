import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Next.js recommended configs
  ...nextVitals,
  ...nextTs,

  // Add/override ignores (flat config way)
  globalIgnores([
    // Next defaults
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Your repo ignores
    "node_modules/**",
    "src/generated/**",        // prisma client output dir
    "prisma/migrations/**",    // migration SQL files
    "coverage/**",
    ".vercel/**",
    "**/*.min.*",
  ]),
]);
