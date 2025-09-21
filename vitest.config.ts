import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // For DOM testing
    globals: true, // Enable global test functions
  },
});
