// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    adapter: node({
        mode: "standalone",
    }),

    vite: {
        server: {
            cors: {
                origin: "http://localhost:5173",
                credentials: true,
            },
        },
    },
});
