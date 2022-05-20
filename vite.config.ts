import { defineConfig } from "vite";

export default defineConfig({
  server: {
    https: {
      key: "./localhost-key.pem",
      cert: "./localhost.pem",
    },
  },
});
