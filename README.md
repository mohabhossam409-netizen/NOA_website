# NOA Landscaping Website

A lightweight static website (HTML + CSS + JavaScript, no frameworks, no build step).

## Project structure

```
nda-landscaping-website/
├── index.html            all page content (text, services, gallery, contact)
├── css/style.css         design (colors are at the top, in :root)
├── js/main.js            menu, gallery lightbox, animations, Facebook setting
├── images/               photos and logos
│   ├── *.jpg             project photos (-sm = smaller version used in grid)
│   ├── logo-*.png        NOA logo in blue and white (transparent background)
│   └── og-image.jpg      picture shown when the link is shared on WhatsApp/Facebook
├── favicon.png
└── apple-touch-icon.png
```

## Run locally

Double-click `index.html` to open it in your browser.
Or, from this folder, run `python3 -m http.server 8000` and open http://localhost:8000

## Deploy for free (pick one)

**Netlify (easiest, no account setup needed to try):** go to https://app.netlify.com/drop and drag this whole folder onto the page. You get a public link immediately. Create a free account to keep it and add your own domain later.

**Cloudflare Pages:** Workers & Pages > Create > Pages > Upload assets, then upload the folder.

**GitHub Pages:** create a repository, upload all files, then Settings > Pages > Deploy from branch > `main` / root.

After deploying, open `index.html` and replace `content="images/og-image.jpg"` with your full address, for example `content="https://your-site.netlify.app/images/og-image.jpg"`. Facebook and WhatsApp need the full address to show the preview picture.

## How to change things

**WhatsApp number**  
In `index.html`, use Find & Replace (Ctrl+F / Cmd+F in any editor):
- `201114496996` to your new number (country code first, digits only, no + or spaces)
- `+20 111 449 6996` to how you want the number displayed
- `+201114496996` (in the structured data near the top of the file)

**WhatsApp message**  
The pre-filled text is the part after `?text=` in each WhatsApp link (spaces written as `%20`).

**Facebook page**  
Open `js/main.js` and change the address in `const FACEBOOK_URL = "...";` (leave it empty to hide the Facebook links). Also update the same address under `"sameAs"` in the structured data at the top of `index.html`.

**Services**  
In `index.html`, find the section marked `SERVICES`. Each service is one `<article>` block: change the title, description and image path.

**Images**  
Replace files inside `images/` keeping the same file names (recommended size: 1200 px wide for full photos, about 720 px wide for the `-sm` versions; JPG, under 500 KB each). To add a photo to Our Work, copy one `<button class="g-item ...">` block in the gallery, and change its two image paths and the alt text (a short description of the photo).

**Company name**  
Search for `NOA` in `index.html` (title, About section, footer, structured data). The logo files are in `images/`.

**Colors**  
Top of `css/style.css`, in the `:root` block: `--brand` is the main blue (taken from the logo), `--brand-dark` the dark blue, `--tint` the very light blue.

## Still missing (add when available)

- Location / service area and working hours (not shown until provided)
- A dedicated photo of an irrigation system (that card uses a photo of a planter with tubing)
- Website address (for `og:image`, and to add `url` and `address` to the structured data in `index.html`)
- Confirm that `images/3d-design-render.jpg` (used on the 3D Garden Design card) is your own 3D work
- The palm photo has the company logo baked into it as a watermark; if you have the original without it, replace `images/palm-trees.jpg`
