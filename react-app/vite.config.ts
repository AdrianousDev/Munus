import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],

    base: "/app/",

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:4321",
                changeOrigin: false,
            },
        },
    },

    build: {
        outDir: resolve(__dirname, "../astro-app/public/app"),
        emptyOutDir: true,
    },
});
