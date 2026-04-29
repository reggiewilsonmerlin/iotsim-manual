# IOTSIM Complete User Manual — PWA

The encyclopaedic reference for the Infinite Outcome Trade Simulator & Insight Monitor.

## What's in this package

A self-contained Progressive Web App (PWA) containing the complete user manual — 73 chapters covering every setting, every Monitor page, every workflow, and every term used by the indicator.

- **Front matter** — Prologue + Foundations
- **Part 1** — 45 settings-group chapters (every setting in the indicator)
- **Part 2** — 7 Insight Monitor chapters (every page, every row)
- **Part 3** — 6 workflow chapters (baseline tuning, direction tuning, filter layering, model pruning, troubleshooting)
- **Part 4** — 7 FAQ and troubleshooting chapters
- **Appendices** — Emoji Key, Base Setups, Insight Monitor Optimisation (24 recipes), Life Hacks
- **Reference** — Glossary and alphabetical Index

Six interactive widgets throughout:
- Leverage/Margin Calculator (Group 4)
- Setup Mirroring Demo (Group 5)
- Fibonacci Entry Visualiser (Group 6 — also on Group 17)
- SL Method Explorer (Group 11 — also on Group 22)
- Killzone Timeline with live "now" marker (Group 29)
- Macro Timeline (Group 30)
- Alert Template Builder (Group 45)

## How to use it

### Option 1 — Local HTTP server (recommended — enables full PWA features)

PWAs need to be served over HTTP for the service worker to register. That's what gives you offline access and the "Install" prompt.

```
# Extract the zip, then in the extracted folder:
python3 -m http.server
```

Then open **http://localhost:8000/** in any modern browser. Click the install prompt when it appears — or, on mobile, use "Add to Home Screen" from the browser menu. Once installed the manual runs offline without the HTTP server.

Alternatives:
- Node: `npx http-server` in the extracted folder
- VS Code: install the "Live Server" extension, right-click `index.html`, select "Open with Live Server"
- Any other static HTTP server works

### Option 2 — Direct browser (limited)

You can open `index.html` directly in a browser but the service worker won't register, so install prompt and offline mode are unavailable. Content and all interactive widgets work regardless.

### Option 3 — Host online

Upload the extracted folder to any static hosting service (GitHub Pages, Netlify, Vercel, Cloudflare Pages, your own server). Once hosted, anyone with the URL can install the manual as a PWA directly from the browser.

## Using the manual

- **Sidebar navigation** — expand/collapse chapter groups; click any chapter to load it.
- **Search box (top of sidebar)** — type any term; full-text search across all 73 chapters with highlighted context snippets.
- **Quick / Full view toggle (top-right of every chapter)** — Quick keeps deep-dive drawers collapsed; Full expands every drawer so the chapter reads as continuous prose. Your choice is remembered across sessions.
- **Deep-dive drawers** — click any drawer head in Quick mode to expand just that one.
- **URL hashes** — every chapter has a direct URL (e.g. `…/index.html#g29`). Share links; bookmark chapters; use back/forward buttons.

## Files

- `index.html` — PWA shell (sidebar nav, search, dynamic chapter loading)
- `manifest.json` — PWA manifest (name, icons, install config)
- `sw.js` — service worker (caches everything for offline use)
- `content.json` — all 73 chapters as pre-rendered HTML
- `assets/theme.css` — full visual theme
- `assets/interactions.js` — all widget handlers
- `icon192.png`, `icon512.png`, `logo.png` — icons and branding

## Credits

© Reggie_W 2026+. All rights reserved. Unauthorized copying, modification, distribution, or use is prohibited.
