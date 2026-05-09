# TEMPLATE.md

## Purpose
This file explains how to update the HTML site content, styling, and structure for this repository.

## Files and structure
- `index.html` — main homepage content.
- `blog.html` — blog listing or content page.
- `projects.html` — project portfolio page.
- `post-template.html` — reusable HTML template for blog posts or new pages.
- `assets/css/style.css` — site styling and layout rules.
- `assets/js/main.js` — site behavior and interactivity scripts.
- `GUIDE.md` — local guide file; it is intentionally ignored by Git.
- `CNAME` — custom domain configured for GitHub Pages (`sipbuu.me`).

## How to update content
1. Open the HTML file you want to change.
2. Edit the page title inside the `<title>` tag and any `<meta>` tags if needed.
3. Update page text in the `<body>` section.
4. Modify navigation links by changing anchor tags (`<a href="...">`) inside the header or menu.
5. Use `post-template.html` as a starting point for new pages or blog posts.

## How to update styling
- Edit `assets/css/style.css` to change colors, spacing, typography, layout, and responsive rules.
- Keep class names consistent between HTML and CSS.
- If you add a new section, add a related class name in the HTML and define its styles in the CSS file.

## How to update scripts
- Edit `assets/js/main.js` for interactive behavior, menu toggles, animations, or other site logic.
- Keep DOM selectors in sync with the HTML element IDs and classes.

## Adding a new page
1. Copy `post-template.html` and rename the copied file.
2. Change the title, heading, and content to match the new page.
3. Add a navigation link to the new page in the site header or menu.
4. Save and preview the page in your browser.

## GitHub Pages and deployment
- `CNAME` is included so GitHub Pages can serve the site from `sipbuu.me`.
- Push the repository to GitHub and enable Pages for the repository if not already enabled.

## Notes
- `GUIDE.md` is intentionally hidden from Git tracking by `.gitignore`.
- To preview locally, open the HTML files directly in your browser.
- Use `git status` to confirm which files are tracked and ignored.
