# Changelog

## [main-2] — 2026-07-24

### Changed
- Reformatted `content.json` with multi-line object layout for improved readability
- Reformatted CSS, JS, and HTML files (code style/formatting pass)
- Updated `vite.config.js` formatting

## [main-1] — 2026-07-24

### Added

- Initial project scaffolding with Vite 5 (vanilla JS template)
- Material Web (`@material/web`) MD3 component library integration
- Complete MD3 theme system with calming teal color palette
- Accessibility features: skip navigation link, font-size toggle (A/A⁺/A⁺⁺), high-contrast mode, reduced-motion support, large touch targets (≥48px), clear focus indicators, 18px base body font
- Responsive layout with mobile navigation drawer, sticky phone FAB, and card grids
- 6 fully structured HTML pages:
  - **Home** — Hero section, highlight cards, quick links, embedded map, CTA strip
  - **About/Location** — Practice history, contact info with icons, opening hours, parking & accessibility cards
  - **Services** — 12 service cards across 3 categories (Diagnostic, Surgical, Treatment)
  - **Our Team** — 4 physician cards with credentials/specialties + 4 staff cards
  - **FAQs** — 14 expandable Q&A items across 3 categories (Symptoms, Treatments, Appointments)
  - **Contact** — Netlify Forms inquiry form with 5 fields, subject dropdown, sidebar contact info
- Build-time content injection system:
  - `content.json` — centralized content file (all text, nav, hours, team data, FAQs, form labels)
  - `scripts/generate.mjs` — template processor supporting `{{placeholder}}` and `{{#each}}` with nested iteration
  - `npm run generate` / `npm run dev` / `npm run build` scripts
- `netlify.toml` — Netlify deployment configuration
- `vite.config.js` — Multi-page build config (6 HTML entry points)
- `docs/DEV.md` — Comprehensive developer documentation covering setup, content editing, accessibility, deployment, and debugging
