import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://switchstyle.laravel.cloud",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
      "/sanctum": {
        target: "https://switchstyle.laravel.cloud",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
      "/storage": {
        target: "https://switchstyle.laravel.cloud",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});