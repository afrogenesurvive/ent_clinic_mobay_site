import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        services: resolve(__dirname, "services.html"),
        team: resolve(__dirname, "team.html"),
        faq: resolve(__dirname, "faq.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
