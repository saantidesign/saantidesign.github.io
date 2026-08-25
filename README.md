# Portfolio site

A minimal, catalog-index-styled portfolio site. Pure HTML/CSS/JS — no build step, so it works directly with GitHub Pages.

## Files

- `index.html` — page structure and placeholder content
- `style.css` — all styling (design tokens at the top of the file)
- `script.js` — small scroll-based nav highlight

## Before you publish

1. Swap the placeholder name, role, bio, and project entries in `index.html` for your own.
2. Replace the `entry-swatch` gradient blocks with real project thumbnails if you'd like — swap the `<span class="entry-swatch ...">` for an `<img>` and adjust `.entry-swatch` in `style.css` (`object-fit: cover` etc.).
3. Update the email and social links in the Contact section.
4. Update the `<title>` and `<meta name="description">` tags.

## Deploy with GitHub Pages

1. Create a new repository on GitHub (e.g. `your-username.github.io` for a root domain site, or any name for a project site).
2. Push these three files to the repository's default branch:
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
