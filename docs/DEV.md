# Developer Guide — ENT Clinic Mobay

## Overview

A static informational website for an ENT medical practice in Montego Bay, Jamaica. Built with **Vite**, **Vanilla JS**, and **Material Web (MD3)** components. Content is managed centrally via `content.json` and injected at build time.

## Tech Stack

| Layer              | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Build tool         | Vite 5                                                       |
| UI framework       | Vanilla HTML/CSS (no SPA framework)                          |
| Component library  | Material Web (`@material/web`) — Google's MD3 Web Components |
| Icons              | Emoji / Material Symbols                                     |
| Content management | `content.json` — build-time injection                        |
| Form handling      | Netlify Forms (no backend needed)                            |
| Deployment         | Netlify (static export)                                      |

## Project Structure

```
ent_clinic_mobay_site/
├── index.html              # Home page — hero, highlights, map, CTA
├── about.html              # About / Location page
├── services.html           # Services page (Diagnostic, Surgical, Treatment)
├── team.html               # Team page (Physicians + Staff)
├── faq.html                # FAQs page (3 categories, 14 Q&As)
├── contact.html            # Contact form + inquiry page
├── content.json            # ALL text content (editable by non-devs)
├── netlify.toml            # Netlify deployment configuration
├── vite.config.js          # Vite multi-page configuration
├── package.json            # Dependencies and scripts
├── scripts/
│   └── generate.mjs        # Build-time content injection script
├── assets/
│   ├── styles/
│   │   └── main.css        # MD3 theme, layout, accessibility, responsive
│   └── scripts/
│       ├── app.js          # Navigation, drawer, init
│       └── accessibility.js # Font-size toggle, high-contrast toggle
└── docs/
    └── DEV.md              # This file
```

## How Content Injection Works

1. **`content.json`** contains ALL text content for the site — headings, paragraphs, card data, FAQ Q&As, team bios, form labels, footer text.

2. **HTML templates** use placeholder syntax that the generator replaces:
   - `{{pages.home.hero.title}}` — simple value replacement
   - `{{#each pages.home.highlights.cards}}...{{/each}}` — array iteration
   - Inside `{{#each}}`, use `{{title}}`, `{{text}}` etc. to access item properties
   - Nested `{{#each}}` blocks are supported (e.g., services categories → cards)

3. **`scripts/generate.mjs`** reads `content.json`, processes each HTML file, replaces placeholders, and writes the result back to the same file.

## Development Workflow

### First Time Setup

```bash
npm install
```

### Local Development

```bash
npm run dev
```

This runs: `node scripts/generate.mjs && vite`

- Generates HTML from templates + content.json
- Starts Vite dev server with hot reload
- Opens at `http://localhost:5173`

### Production Build

```bash
npm run build
```

This runs: `node scripts/generate.mjs && vite build`

- Generates HTML
- Builds to `dist/` folder
- Output: 6 HTML pages + 1 CSS file + 1 JS file

### Preview Production Build

```bash
npm run preview
```

Serves the `dist/` folder locally.

### Content-Only Regeneration

```bash
npm run generate
```

Only runs the content generator (no Vite build). Useful to see template output without building.

## Editing Content

To change any site text, edit ONLY `content.json`. No HTML changes needed.

### Content Structure

```json
{
  "site": {
    "name": "ENT Clinic Mobay",
    "phone": "(876) 555-1234",
    "email": "info@entclinicmobay.com",
    "address": { "street": "123 Main Street", ... },
    "hours": [
      { "day": "Mon – Fri", "time": "8:00 AM – 5:00 PM" },
      ...
    ],
    "nav": [
      { "label": "Home", "href": "/" },
      ...
    ]
  },
  "pages": {
    "home": { ... },
    "about": { ... },
    "services": { ... },
    "team": { ... },
    "faq": { ... },
    "contact": { ... }
  }
}
```

### Adding New Content

1. Add your data to `content.json` under the appropriate page
2. Add the placeholder (e.g., `{{pages.home.new_section_title}}`) to the HTML template
3. Run `npm run generate` to test

## Accessibility Features

| Feature                         | Implementation                                         |
| ------------------------------- | ------------------------------------------------------ |
| Skip navigation link            | First focusable element on every page                  |
| Font-size toggle (A / A⁺ / A⁺⁺) | Mobile drawer, persists in `localStorage`              |
| High-contrast mode toggle       | Mobile drawer, persists in `localStorage`              |
| 18px base body font             | Elderly-friendly readability                           |
| Large touch targets (≥48px)     | All interactive elements                               |
| Reduced motion support          | Respects `prefers-reduced-motion`                      |
| Clear focus indicators          | 3px `outline` on `:focus-visible`                      |
| Semantic HTML                   | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` |
| `aria-current="page"`           | Active nav link marking                                |
| Native `<details>` FAQ          | Best screen reader support                             |
| Hours as list (not table)       | Better mobile readability for elderly                  |

## Netlify Deployment

### Automatic (recommended)

1. Push to GitHub
2. In Netlify Dashboard → **Add new site** → **Import from Git**
3. Select repo → Netlify auto-detects config from `netlify.toml`
4. Enable **Netlify Forms** in Site Settings → Forms

### Manual

1. `npm run build` — generates `dist/`
2. Drag-and-drop `dist/` folder into Netlify Deploy page

### Netlify Forms

The contact form uses Netlify Forms — no backend needed. Submissions appear in:
**Netlify Dashboard → Your Site → Forms**

The form is configured with:

- `name="contact"` attribute on `<form>`
- `netlify` attribute (or `data-netlify="true"`)
- Hidden `form-name` input

## Debugging Tips

### Content generator issues

```bash
node scripts/generate.mjs  # Shows which files were processed
```

Look for `⚠ Missing content key` warnings — they indicate placeholders not found in `content.json`.

### Vite build issues

```bash
npm run build  # Shows build output and any errors
```

### Browser testing

- Open DevTools → **Console** for JS errors
- DevTools → **Lighthouse** → Run accessibility audit
- Test keyboard navigation: Tab through all interactive elements
- Test at 200% browser zoom
- Test with screen reader (VoiceOver on macOS: Cmd+F5)

## Adding a New Page

1. Create the HTML template file with `{{placeholder}}` syntax
2. Add the content section to `content.json`
3. Add the file to `vite.config.js` → `build.rollupOptions.input`
4. Add a nav link in `content.json` → `site.nav` and `site.nav_mobile`
5. Test with `npm run dev`
