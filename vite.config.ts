import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

/**
 * Source lives in site/; the build lands in dist/, which also carries the
 * static passthrough files (img/, the resume PDF) that the document shell
 * links to by absolute path. dist/ is what the VPS deploy rsyncs.
 *
 * The repo also doubles as the GitHub Pages document root, so after the build
 * scripts/publish.mjs copies index.html + assets/ back to the repo root —
 * those two are committed build output. Building into the root directly is
 * what Vite warns about, and with emptyOutDir it would delete the repo.
 */
export default defineConfig({
    root: fileURLToPath(new URL("./site", import.meta.url)),
    base: "/",
    publicDir: false,
    plugins: [react()],
    build: {
        outDir: fileURLToPath(new URL("./dist", import.meta.url)),
        emptyOutDir: true,
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
