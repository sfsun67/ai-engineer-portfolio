# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Engineer portfolio website — a React 18 SPA with a retro pixel/terminal aesthetic. Showcases AI/ML projects with filterable categories and detailed project pages with live demo links.

## Build & Dev

- **Dev server:** `npm run dev` (Vite)
- **Build:** `npm run build` (Vite)
- **Preview:** `npm run preview` (serves production build)
- **Package manager:** npm

## Architecture

- **Vite + React 18 + TypeScript + Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **Routing:** React Router v7 (`createBrowserRouter`) with three routes:
  - `/` → Home (project grid with category filters)
  - `/project/:id` → ProjectDetail (Notion-style writeup)
  - `/demo/:id` → Demo (standalone, outside Layout)
- **Path alias:** `@` → `./src` (configured in `vite.config.ts` and `tsconfig.json`)

### Key directories

- `src/app/pages/` — page components (Home, ProjectDetail, Demo)
- `src/app/components/ui/` — shadcn/ui component library (Radix-based)
- `src/app/data/projects.ts` — project data with typed `Project` interface
- `src/styles/` — CSS layers: `index.css` imports `fonts.css`, `tailwind.css`, `theme.css`; `pixel.css` is imported directly in `App.tsx`

### Styling approach

- **Tailwind v4** with shadcn/ui design tokens defined as CSS custom properties in `theme.css`
- **Custom pixel/retro CSS classes** in `pixel.css`: `.bg-pixel-grid`, `.bg-scanline`, `.pixel-shadow`, `.pixel-shadow-sm`, `.pixel-shadow-hover`, `.notion-container`
- Brand colors used directly as hex values: red `#E43B44`, blue `#1D79E4`, green `#4DA65C`, yellow `#F4D330`, orange `#F48B29`
- Components use `font-mono` for terminal aesthetic, `font-sans` for readable content

### Data model

Project data exists in two places (currently not unified):
- `src/app/pages/Home.tsx` — inline `projects` array with categories, metrics, themes, sizes
- `src/app/data/projects.ts` — exported `projectsData` with roles, tags, systemDesign, challenges, outcomes, reflection
- `src/app/pages/ProjectDetail.tsx` — inline `projectData` record with detailed writeup fields

Note: project IDs differ between Home (`rag-engine`) and data/ProjectDetail (`rag-pipeline`).

## Vite Config Notes

- `assetsInclude` supports raw imports for `.svg` and `.csv` — never add `.css`, `.tsx`, or `.ts`
