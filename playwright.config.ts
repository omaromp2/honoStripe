import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:8787", // Replace with your Cloudflare Workers URL
  },
});
