# WALTIVE Product Training Guide — Multi-Page Website

A production-ready, static multi-page website for the WALTIVE Canton Fair 2026 product
training guide. Pure HTML, CSS and JavaScript — no frameworks, no build step, no
dependencies. Deployable on GitHub Pages (or any static host) as-is.

## What's Inside

| Layer | Role | Files |
|---|---|---|
| **HTML — content & structure** | Page titles, product info, spec tables, packaging tables, navigation and page sections | `index.html` + 9 category/resource pages + `404.html` |
| **CSS — design & responsive** | Colors, fonts, layout, cards, spacing, mobile menu, print styles | `assets/css/styles.css` |
| **JavaScript — interactivity** | Global product search, nav highlighting, mobile menu, table filtering, scrollspy, back-to-top | `assets/js/main.js`, `assets/js/search-data.js` |

## File Structure

```
waltive-website/
├── index.html                  # Home — portfolio overview + resource cards
├── spc-wall-boards.html        # SPC Wall Boards category
├── spc-fluted-panels.html      # SPC Fluted / Grille Panels
├── wpc-fluted-panels.html      # WPC Fluted / Grille Panels
├── black-pvc-boards.html       # Black PVC Boards
├── mouldings.html              # SPC Decorative Mouldings
├── partition-wall-system.html  # Partition Wall System (NEW 2027)
├── packaging.html              # Packaging & logistics comparison
├── cheat-sheet.html            # Quick price cheat sheet
├── sales-tips.html             # Canton Fair sales playbook
├── 404.html                    # Custom not-found page
├── .nojekyll                   # Tells GitHub Pages to serve files as-is
├── README.md                   # This file
└── assets/
    ├── css/
    │   └── styles.css          # All styling (one shared stylesheet)
    ├── js/
    │   ├── search-data.js      # Search index (product/SKU data only)
    │   └── main.js             # All interactive behavior
    └── img/
        └── favicon.svg         # Browser tab icon
```

Every page shares the same header (brand, navigation, search) and footer. Each
category page has its own color theme, in-page sub-navigation, and prev/next
pagination, so the guide reads like a book.

## Run It Locally

No build step is required. Either:

- Double-click `index.html` (search works best over HTTP), or
- Serve it with any static server:
  ```bash
  # Python
  python3 -m http.server 8080
  # then open http://localhost:8080

  # Node
  npx serve .
  ```

## Publish on GitHub Pages

### Option A — Upload in the browser (fastest)

1. Sign in to GitHub and click **New repository**.
   - Repository name: anything, e.g. `waltive-product-guide` (or `astra`).
   - Visibility: **Private** is fine — Pages works on private repos with a paid
     plan; use **Public** for free hosting.
2. On the repo page, click **Add file → Upload files**, then drag in **everything
   inside this folder** (`index.html`, all `.html` pages, `.nojekyll`, `README.md`
   and the `assets/` folder). Commit with message "Initial site upload".
3. Open **Settings → Pages**. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` / folder: `/ (root)` → **Save**
4. Wait 1–2 minutes, then open `https://<your-username>.github.io/<repo-name>/`.

### Option B — Command line (recommended for ongoing work)

```bash
git init -b main
git add .
git commit -m "Publish WALTIVE multi-page guide"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then enable Pages: **Settings → Pages → Deploy from a branch → main / (root) → Save**.

### Using a custom domain (optional)

1. In your DNS provider, point a `CNAME` record for `www.yourdomain.com` to
   `<your-username>.github.io`.
2. In **Settings → Pages → Custom domain**, enter the domain and save. GitHub
   creates HTTPS certificates automatically.

## Maintenance Guide — What to Edit Where

- **Change content on one page** (prices, tables, text): edit that page's `.html`
  file. Each section has a comment header, e.g. `<!-- PACKAGING -->`.
- **Change colors, spacing, or layout**: edit `assets/css/styles.css`. All colors
  are CSS variables at the top (`:root { … }`) — change `--green` once and it
  updates the whole site.
- **Add a new page**: copy any category page, update its hero, content and
  `data-page` attribute, then add a matching link (with `data-nav`) in the header
  nav and footer of every page.
- **Update search results**: edit `assets/js/search-data.js` — one entry per
  product/topic with `t` (title), `c` (category), `p` (price), `u` (link), `k`
  (keywords).
- **Change behavior** (menu, scrollspy, filtering): edit `assets/js/main.js`.

## JavaScript Features

- **Global search** — header search box queries ~50 products, SKUs and topics;
  keyboard navigable (arrow keys + Enter), jumps straight to the right page/section.
- **Table filtering** — every page with spec/packaging tables gets a live
  "Filter tables" bar (try `300mm`, `gold line`, or `CBM`).
- **Navigation highlighting** — the current page is highlighted in the main nav;
  the in-page sub-nav highlights the section you're reading (scrollspy).
- **Mobile menu** — hamburger menu below 900px, plus a full-width search bar.
- **Back-to-top button** — appears after scrolling.

## Notes

- The product claims, prices, certifications, logistics data and quotation dates
  were retained from the original training guide and have not been independently
  verified. Confirm internally before public release.
- All prices FOB Ningbo, October 2026 quotation, valid 30 days.
- WALTIVE — Jinhua Huating New Materials Co., Ltd., Jinhua, Zhejiang, China.
