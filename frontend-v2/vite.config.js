import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { validateBuildConfig } from "./scripts/validate-build-config.mjs";

export default defineConfig(({ command, mode }) => {
  if (command === "build") {
    validateBuildConfig(loadEnv(mode, process.cwd(), ["VITE_GOLD_", "GOLD_WEBSITE_"]));
  }
  return { plugins: [reactRouter()] };
});
