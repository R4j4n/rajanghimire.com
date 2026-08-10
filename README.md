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

index.html            BUILD OUTPUT — do not edit by hand
assets/               BUILD OUTPUT
```

The repo doubles as the GitHub Pages document root, so `npm run build`
writes `index.html` and `assets/` back to the repo root. Commit those
along with your source changes and Pages serves the new build.

## Commands

```bash
npm install
npm run dev      # local dev server with HMR
npm run build    # clears assets/, rebuilds into the repo root
npm run preview  # serve the built output
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
