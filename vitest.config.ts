import { config } from "dotenv";
import { defineConfig } from "vitest/config";

config({ path: ".env.test", quiet: true });

export default defineConfig({
  test: {
    globalSetup: ["tests/setup/global-setup.ts"],
    setupFiles: ["tests/setup/reset-db.ts"],
    fileParallelism: false,
    coverage: {
      include: ["src/**"],
      exclude: ["src/server.ts"],
    },
  },
});
