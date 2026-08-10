# rajanghimire.com

Portfolio of Rajan Ghimire — ML Engineer & AI Systems Builder.
React + Vite, monochrome, canvas-driven.

## Layout

```
site/                 source (Vite root)
  index.html          document shell, meta tags, JSON-LD
  src/
    data.ts           all copy — edit here, not in the components
    styles.css        design tokens + every component's styles
    App.tsx           page assembly
    components/       Nav, Preloader, Footer, shared primitives
    sections/         Hero, About, Work, Stack, Projects, Research, Contact
    effects/          the seven canvas/WebGL components

img/, Resume_2026.pdf static files the document shell links to
dist/                 BUILD OUTPUT — the deployable site (git-ignored)
index.html            BUILD OUTPUT — do not edit by hand
assets/               BUILD OUTPUT
```

`npm run build` typechecks, builds into `dist/`, copies the static files
in beside it, then publishes `index.html` + `assets/` back to the repo
root. Two consumers, one build:

- the VPS deploy (`.github/workflows/deploy.yml`) rsyncs `dist/`, which
  is why the static files have to be copied into it — `publicDir` is off
  and rsync runs with `--delete`;
- the repo also doubles as the GitHub Pages document root, so commit the
  root `index.html` and `assets/` along with your source changes.

## Commands

```bash
npm install
npm run dev        # local dev server with HMR
npm run typecheck  # tsc --noEmit
npm run build      # typecheck, build to dist/, publish to the repo root
npm run preview    # serve the built output
```

## The effects

Each one started as an Originkit/Framer component, with the property-control
plumbing stripped and an IntersectionObserver added so its animation loop
only runs while on screen.

| Component            | Used in                     |
| -------------------- | --------------------------- |
| `ReactiveLines`      | hero backdrop               |
| `DustTextReveal`     | hero name                   |
| `Typewriter`         | hero role line              |
| `TextSphere`         | about section globe         |
| `BlackHole`          | work section header         |
| `RubikParticles`     | projects section (draggable)|
| `ParticleSphere`     | contact backdrop (WebGL)    |

`ParticleSphere` is code-split — three.js is only fetched when the
contact section mounts — and is skipped entirely on coarse-pointer or
narrow viewports. Every effect honours `prefers-reduced-motion`.

## Editing content

Everything visible on the page comes from `site/src/data.ts`: roles,
bullets, projects, publications, skills, contact links. Adding a project
is one entry in the `projects` array; its `kind` decides which tab it
lands under — `software` for models and pipelines, `engineering` for the
systems software around them.
