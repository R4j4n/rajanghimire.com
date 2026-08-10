import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

/**
 * The repo doubles as the GitHub Pages document root (Pages serves
 * main/ at rajanghimire.com), so the build writes its output back to the
 * repo root: index.html + assets/. Source lives in site/.
 *
 * emptyOutDir is off because the root also holds CNAME, img/, Resume PDF
 * and the git metadata — scripts/clean.mjs removes only the stale build
 * artefacts before each build.
 */
export default defineConfig({
    root: fileURLToPath(new URL("./site", import.meta.url)),
    base: "/",
    publicDir: false,
    plugins: [react()],
    build: {
        outDir: fileURLToPath(new URL(".", import.meta.url)),
        emptyOutDir: false,
        assetsDir: "assets",
        target: "es2020",
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ["three"],
                    motion: ["framer-motion"],
                },
            },
        },
    },
})
