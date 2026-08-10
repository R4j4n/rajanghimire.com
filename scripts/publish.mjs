import { access, cp, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"

/**
 * Post-build step. Vite writes dist/; this puts the two things Vite cannot
 * know about into place.
 *
 * 1. The static passthrough files. publicDir is off (the source root is site/,
 *    while these live at the repo root), so index.html's absolute references
 *    to /img/hero.png and /Resume_2026.pdf would 404 on any host served from
 *    dist/ alone — which is exactly what the VPS deploy rsyncs, with --delete.
 *
 * 2. A copy of index.html + assets/ at the repo root, because the repo also
 *    serves as the GitHub Pages document root. Those two are committed build
 *    output; everything else at the root is source and is left alone.
 */

const root = new URL("../", import.meta.url)
const dist = new URL("dist/", root)

// Copied into dist/ so a host serving dist/ has a complete site.
const PASSTHROUGH = ["img", "Resume_2026.pdf", ".nojekyll"]

// Copied back to the repo root for Pages. Anything listed here is build
// output: it is removed from the root first, so stale hashed bundles go away.
const PUBLISHED = ["index.html", "assets"]

const exists = async url => {
    try {
        await access(url)
        return true
    } catch {
        return false
    }
}

for (const name of PASSTHROUGH) {
    const from = new URL(name, root)
    if (!(await exists(from))) {
        console.warn(`publish: skipped ${name} — not found at the repo root`)
        continue
    }
    await cp(from, new URL(name, dist), { recursive: true })
}

for (const name of PUBLISHED) {
    await rm(new URL(name, root), { recursive: true, force: true })
    await cp(new URL(name, dist), new URL(name, root), { recursive: true })
}

console.log(
    `published ${PUBLISHED.join(", ")} to ${fileURLToPath(root)}` +
        ` (dist/ also carries ${PASSTHROUGH.join(", ")})`
)
