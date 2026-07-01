# AURUM landing page — configuration & assets

No build step. Everything is driven from **one `CONFIG` object at the top of
`script.js`** — price, edition, countdown, checkout link, and photo paths. Edit
that, refresh, done.

```js
const CONFIG = {
  productName:     'The Executive — 24K',
  unitPrice:       179.45,
  currencySymbol:  '$',
  edition:         1776,
  remaining:       412,
  dropDurationHrs: 71,
  checkoutUrl:     '',          // ← Stripe Payment Link (see below)
  photos: { hero: '', gallery: ['','','','','',''], finish: '', certificate: '', box: '' },
};
```

Price changes propagate automatically to the nav, hero stats, order card, and
final CTA (they read from `CONFIG.unitPrice` — no hunting through the HTML).

---

## 1 · Real checkout (Stripe Payment Link)

1. In the [Stripe Dashboard](https://dashboard.stripe.com/payment-links) →
   **Payment Links** → create a link for the product at your price.
   (Optional: enable **Adjustable quantity** and **Collect shipping address**.)
2. Copy the link (looks like `https://buy.stripe.com/xxxxxxxx`).
3. Paste it into `CONFIG.checkoutUrl` in `script.js`.

That's it. Once set:
- The order-card button becomes **“Checkout”** and sends the buyer to Stripe,
  pre-filling their email (`?prefilled_email=`).
- Quantity is adjusted on Stripe's page (if you enabled adjustable quantity).
- Leave `checkoutUrl: ''` and the page keeps the front-end **reservation** flow
  (email capture + confirmation) with no real payment taken.

> Note: creating the link requires signing into your Stripe account — do that
> yourself; never paste card or bank details into the page.

---

## 2 · Real photography

The product visuals are stylised inline-SVG placeholders so the page looks
complete today. To use photos, just point `CONFIG.photos` at files in `/assets`:

```js
photos: {
  hero:        'assets/product-hero.jpg',
  gallery:     ['assets/gallery-1.jpg', 'assets/gallery-2.jpg', /* …6 total */],
  finish:      'assets/finish-detail.jpg',
  certificate: 'assets/certificate.jpg',
  box:         'assets/box.jpg',
}
```

Any slot left `''` keeps its SVG placeholder. A photo that fails to load falls
back to the placeholder automatically. Photos also flow into the lightbox.

**Suggested files** (dark background, warm key light, to match the theme):

| Key           | Where it shows          | Recommended       |
|---------------|-------------------------|-------------------|
| `hero`        | Hero stage              | 1200×1440, dark bg |
| `gallery[0…5]`| Gallery grid (6 frames) | 1000×1250 each     |
| `finish`      | “A mirror you can hold” | 1000×1250          |
| `certificate` | “Numbered. Sealed.”     | 1000×1250          |
| `box`         | “Arrives like it matters” | 1000×1250        |
| `og.jpg`      | Social share image      | 1200×630 (also update the `og:image` meta tag) |

Gallery captions come from each frame's `data-label` in `index.html`.

---

## 3 · Theme

Switch the whole palette from one attribute on `<html>` in `index.html`:

```html
<html lang="en" data-theme="aurum">      <!-- default: obsidian + gold -->
<html lang="en" data-theme="patriot">     <!-- deep navy + gold + red/blue accents -->
<html lang="en" data-theme="platinum">    <!-- cooler, brighter champagne gold, minimal -->
```

Add your own by copying a `[data-theme="…"]` block in `styles.css` and
overriding the design tokens.

---

## Running it

- **Double-click `index.html`** — works fully over `file://`, or
- `python3 serve.py` → open `http://localhost:4321`, or
- any static host (GitHub Pages, Netlify, Vercel — just upload the folder).

Fonts load from Google Fonts; everything else is self-contained.

*A satirical novelty concept, not affiliated with any real person.*
