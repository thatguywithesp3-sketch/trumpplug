# Stripe Payment Link — ready-to-paste product details

Create the link at **dashboard.stripe.com → Payment Links → New**. Copy the
fields below. When done, paste the resulting `https://buy.stripe.com/…` URL into
`CONFIG.checkoutUrl` in `script.js`.

---

## Product

**Name**
```
AURUM — The Executive · 24K Collectible Bust
```

**Description** (shown at checkout)
```
A hand-finished, 24-karat-gold-finished collectible bust on a brushed-obsidian
base. Numbered and sealed, limited to an edition of 20 pieces worldwide — then
the mold is retired. Ships in a gloss-black presentation box with a certificate
of authenticity, display stand, signed card, and cotton gloves. It does nothing.
Magnificently. In gold.
```

**Price**
```
$99.00 USD  ·  one-time
```

**Statement descriptor** (appears on the buyer's card statement, ≤22 chars)
```
AURUM COLLECTIBLE
```

**Product image**
Upload your hero product photo (dark background, warm light). Until you have
photography, you can export `assets/og.svg` to PNG and use that.

---

## Payment Link settings

| Setting | Value |
|---|---|
| Quantity | **Adjustable**, min 1, **max 2** (matches the on-site limit) |
| Collect shipping address | **On** — ship worldwide |
| Collect phone number | Optional |
| Allow promotion codes | Your call |
| After payment | Show confirmation page, or redirect back to the site |
| Inventory | Edition of 20 — either cap with Stripe limits or track manually |

---

## After you have the link

1. Paste it into `script.js`:
   ```js
   checkoutUrl: 'https://buy.stripe.com/xxxxxxxxxxxx',
   ```
2. The order card automatically switches to **“Checkout”** mode and sends buyers
   to Stripe with their email pre-filled.

> Note: creating the link and configuring payouts happens inside your Stripe
> account. Do that yourself — never enter card/bank details into the landing page.
