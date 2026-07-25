# Developer Guide — ENT Clinic Mobay

## Overview

A static informational website for an ENT medical practice in Montego Bay, Jamaica. Built with **Vite**, **Vanilla JS**, and **Material Web (MD3)** components. Content is managed modularly via the `content/` directory and injected at build time.

## Tech Stack

| Layer              | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Build tool         | Vite 5                                                       |
| UI framework       | Vanilla HTML/CSS (no SPA framework)                          |
| Component library  | Material Web (`@material/web`) — Google's MD3 Web Components |
| Icons              | Emoji / Material Symbols                                     |
| Content management | `content/` directory — modular JSON files                    |
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
├── content/                # Modular JSON content files (editable by non-devs)
│   ├── site.json           #   Site-wide settings (nav, footer, hours, a11y)
│   ├── home.json           #   Home page content
│   ├── about.json          #   About page content
│   ├── services.json       #   Services page content
│   ├── team.json           #   Team page content
│   ├── faq.json            #   FAQ page content
│   └── contact.json        #   Contact page content
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

1. **`content/` directory** contains modular JSON files — one per page plus `site.json` for site-wide settings (headings, paragraphs, card data, FAQ Q&As, team bios, form labels, footer text).

2. **HTML templates** use placeholder syntax that the generator replaces:
   - `{{pages.home.hero.title}}` — simple value replacement
   - `{{#each pages.home.highlights.cards}}...{{/each}}` — array iteration
   - Inside `{{#each}}`, use `{{title}}`, `{{text}}` etc. to access item properties
   - Nested `{{#each}}` blocks are supported (e.g., services categories → cards)

3. **`scripts/generate.mjs`** reads all JSON files from the `content/` directory, merges them into a single content tree, processes each HTML file, replaces placeholders, and writes the result back to the same file.

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

- Generates HTML from templates + content/ directory
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

Content is split across multiple files in the `content/` directory. Edit the file for the page you want to change — no HTML changes needed.

| File | Contains |
|------|----------|
| `content/site.json` | Site name, phone, email, address, hours, nav links, footer, a11y settings |
| `content/home.json` | Hero section, highlight cards, quick links, map, CTA |
| `content/about.json` | Practice info, location & contact, parking & accessibility |
| `content/services.json` | Service categories and cards |
| `content/team.json` | Physicians and staff members |
| `content/faq.json` | FAQ categories and Q&A items |
| `content/contact.json` | Contact form fields, subject options, sidebar |

### Content Structure (conceptual)

At build time, all files are merged into this structure:

```
site.*        ← content/site.json
pages.home.*  ← content/home.json
pages.about.* ← content/about.json
pages.services.* ← content/services.json
pages.team.*  ← content/team.json
pages.faq.*   ← content/faq.json
pages.contact.* ← content/contact.json
```

### Adding New Content

1. Add your data to the appropriate file in `content/` (or create a new page file)
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

Look for `⚠ Missing content key` warnings — they indicate placeholders not found in the `content/` directory files.

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
