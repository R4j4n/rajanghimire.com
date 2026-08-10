import { rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"

// Remove only the previous build artefacts from the repo root so that
// CNAME, img/, Resume_2026.pdf, site/ and references/ survive the build.
const root = fileURLToPath(new URL("..", import.meta.url))
await rm(new URL("../assets", import.meta.url), { recursive: true, force: true })
console.log(`cleaned build artefacts in ${root}`)
