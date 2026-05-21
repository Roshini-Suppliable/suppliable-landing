# Suppliable — Landing Page

Marketing landing page for the Suppliable app launch. Single-page site, no build
step, no dependencies. Open `index.html` in a browser to preview.

## Goals it serves
- **Awareness** — bold, public-facing hero + brand strip
- **Trust** — genuine brands, 60-min delivery, transparent steps
- **App installs** — primary Download CTA + sticky header button
- **Bulk enquiries** — working enquiry form in the Bulk Orders section

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page structure & content |
| `styles.css` | All styling — solid purple `#4B22D6`, orange accent `#F26A1B`, no gradients |
| `script.js` | Mobile nav, scroll reveals, stat counters, form validation, demo control |
| `app-demo.html` | **Interactive app demo** — a working mini-version of the Suppliable app |
| `assets/` | Place your images here (see below) |

## Interactive app demo (`app-demo.html`)
A self-contained, working prototype of the app — Home, Search, Cart and Track
Order screens, all clickable. **Open `app-demo.html` directly in a browser** to
review the app on its own (no Supabase, no backend — it runs entirely in the page).

It's also embedded live inside the landing page's "How it works" section, sitting
in a phone frame. The three step cards drive it: clicking a step navigates the
demo (Search → Cart → Track). Visitors can also tap around it freely.

The demo carries the real Suppliable catalogue — 11 categories, 63 products and
the actual brands (UltraTech, Ramco, Finolex, ARS, MYK, Dr. Fixit, etc.) and a
pre-filled cart so every screen has content. Edit the `PRODUCTS`, `CATEGORIES`
and `POPULAR` arrays near the top of the `<script>` block to change what's shown.

> ⚠️ **Prices are representative placeholders.** Swap in the real price sheet
> before launch — see the `price` field on each product in `PRODUCTS`.

## Product images
Each product can show a real photo. Drop image files into `assets/products/`,
named by product id — e.g. `cem1.jpg`, `stl1.jpg`, `pnt1.jpg`.

- Recommended: square `.jpg`, ~600×600px.
- The full filename list is in `assets/products/_FILENAMES.txt` (63 products).
- **Images are optional** — any product with no image falls back to a clean icon
  tile, so the demo works fully right now. Add the top sellers first.

## Other images
The hero and "How it works" sections run the live interactive demo — **no
screenshot files are needed.** The only optional extra is `assets/og-image.png`
(1200×630) for social link previews.

## Before going live — update these placeholders
- **Google Play link** — `index.html`, the `.store-btn` `href="#"` → real Play Store URL
- **Email** — `hello@suppliable.in` in the footer → your real address
- **Company links** — About / Contact / Privacy / Terms `href="#"` in the footer
- **Bulk form submission** — `script.js` has a `TODO` where the form data is
  collected. POST it to your backend, Supabase, or an email service (e.g. Formspree).
  Right now it validates, logs to console, and shows a success message.

## Deploy
Static site — host anywhere:
- **Netlify / Vercel** — drag the folder in, done
- **GitHub Pages** — push and enable Pages
- **Any web host** — upload the folder

## Customisation quick-reference
Colours live as CSS variables at the top of `styles.css` (`:root`).
Categories and brands are plain HTML in `index.html` — edit the text directly.
