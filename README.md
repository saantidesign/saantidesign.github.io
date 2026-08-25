# Portfolio site

A dark (or light) grid-shaded 3D globe as the homepage hub, with your section labels genuinely orbiting around it in 3D. Pure HTML/CSS/JS plus three.js (loaded from a CDN) — no build step, so it works directly with GitHub Pages.

## Files

- `index.html` — homepage: name, globe, a few featured projects, about, contact
- `gallery.html` — full project gallery with filtering
- `style.css` — all styling, both themes (design tokens at the top of the file)
- `script.js` — the globe, orbiting labels, theme toggle, enter gate, and filtering
- `assets/name.svg` — placeholder for your name/logo image — replace this file

## What's new in this version

- **No texture, true rotation** — the globe is a plain shaded sphere with a faint wireframe grid over it (ties into the page's grid background). The section labels are positioned as real points in 3D space and orbit the globe as it spins — they're not just decorations sitting in a static ring.
- **Center badge removed.**
- **Name as an image** — `index.html` now points at `assets/name.svg`, a placeholder telling you to swap in your own. Replace that file with your own image (any format — just update the `src` in `index.html` if you rename it, or keep the filename `assets/name.svg`/`.png` and it'll pick it up automatically).
- **Grid background** — a subtle line grid sits behind the whole site in both themes.
- **Light/dark mode** — the sun/moon toggle in the top-right switches themes and remembers the choice (`localStorage`). It defaults to the visitor's OS preference on first visit.
- **Enter gate** — first-time visitors see a blurred site behind an "Enter" button. Clicking it unblurs and unlocks scrolling. It only shows once per browser session (`sessionStorage`), so it won't reappear if they click between the homepage and the gallery.
- **Gallery page** — `gallery.html` shows every project with the same filter chips as before. The homepage's "Work" orbit label and category labels (Branding, Type, etc.) link straight there with the right filter pre-applied via a `?filter=` URL parameter.
- **Contact links** now point to real URLs (Instagram, Are.na, LinkedIn) — swap in your actual profile links.

## Before you publish

1. Swap the placeholder name, role, bio, and project entries for your own — search for "Ava Moreau" across both HTML files.
2. Replace `assets/name.svg` with your own name/logo image.
3. Replace the `card-plate` gradient blocks with real project thumbnails if you'd like — swap `<span class="card-plate ...">` for an `<img>` and adjust `.card-plate` in `style.css` (`object-fit: cover`, etc.). Add every project to `gallery.html`, and just your featured few to `index.html`.
4. Adjust each project's `data-category` attribute (space-separated) so filters match correctly.
5. Update the email and social links in the Contact section on `index.html`.
6. Update the `<title>` and `<meta name="description">` tags on both pages.

## Deploy with GitHub Pages

1. Create a new repository on GitHub (e.g. `your-username.github.io` for a root domain site, or any name for a project site).
2. Push these files to the repository's default branch:
   ```
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`.
5. Save. GitHub will publish the site, usually within a minute or two, at:
   - `https://your-username.github.io/your-repo/` (project repo), or
   - `https://your-username.github.io/` (if the repo is named `your-username.github.io`)
6. To use a custom domain, add a `CNAME` file with your domain, and configure DNS per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Local preview

Just open `index.html` in a browser, or serve it locally:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
