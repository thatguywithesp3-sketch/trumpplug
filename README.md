# AURUM — The Executive · 24K Collectible

A modern, flashy, luxury-satire landing page for a **limited-edition (20 pieces)
gold collectible bust** — deadpan premium presentation in the spirit of Apple /
Nothing product pages, crossed with a limited "drop" page.

> It does nothing. Magnificently. In gold.

## Highlights

- **Zero dependencies, no build step** — plain `index.html` + `styles.css` + `script.js`.
- **Design-token system** — warm-obsidian base, multi-stop metallic gold, fluid
  `clamp()` type scale (Space Grotesk / Space Mono / Playfair).
- **Fully responsive** — phone, tablet, desktop.
- **Sections** — sticky glass nav, oversized hero, marquee, gallery + lightbox,
  feature blocks, Apple-style spec sheet, scarcity block (live counter +
  countdown), order card, FAQ, final CTA.
- **Motion, tastefully** — scroll reveals, sticky-nav shrink, magnetic buttons,
  parallax, gold sheen — all respecting `prefers-reduced-motion`.
- **Swappable themes** — `aurum` (default), `patriot`, `platinum` via one
  `data-theme` attribute.
- **Commerce-ready** — one `CONFIG` object controls price, edition, countdown,
  Stripe checkout link, and photo paths.

## Run it

```bash
# any of:
open index.html                 # works over file://
python3 serve.py                # → http://localhost:4321
# or drop the folder on GitHub Pages / Netlify / Vercel
```

## Configure

Everything lives in the `CONFIG` object at the top of `script.js` (price,
edition, countdown, `checkoutUrl`, `photos`). See:

- [`assets/README.md`](assets/README.md) — full config, photos, themes, checkout
- [`stripe-product.md`](stripe-product.md) — ready-to-paste Stripe product details

## Note

A satirical **novelty concept**. Not affiliated with, endorsed by, or
representing any public figure, office, or campaign.
