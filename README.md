# Reynolds Restful Getaways — travel website

The complete, dependency-free website for Reynolds Restful Getaways, a travel blog with points, miles, credit-card rewards, guides, referrals, and downloadable tools. It is designed for **GitHub + Cloudflare Pages or GitHub Pages** and costs essentially nothing to host.

## Included

- Markdown blog posts
- Markdown evergreen guides
- Credit-card/referral directory with category filters
- Individual card pages
- Downloadable templates
- Referral/affiliate disclosure language
- Privacy policy and terms/disclaimer starters
- Responsive custom design
- SEO titles, descriptions, canonical URLs, Open Graph tags
- RSS feed
- XML sitemap + robots.txt
- GitHub Pages deployment workflow
- Zero framework dependencies — the build uses Node only

## Quick start

You need Node 22+.

```bash
npm run build
npm run dev
```

Then open `http://localhost:4321`.

## Brand configuration

The site is configured for **Reynolds Restful Getaways** at `https://reynoldsrestfulgetaways.com`. Core brand settings live in `data/site.json`, including the site name, tagline, author, contact email, and partnership email.

Colors and styling live in `public/styles.css`.

## Add your referral cards

Edit `data/cards.json`. Each card has:

- slug
- name
- issuer
- category
- annual fee
- reward summary
- who it is best for
- referral URL
- last-reviewed date
- your notes

The included entries are **demo data**. Replace them before launch.

Referral links automatically use `rel="sponsored nofollow noopener"`.

## Add a post

Run:

```bash
npm run new:post -- "How I booked a trip to Japan with points"
```

That creates a draft in `content/posts/`. Edit the Markdown file, then change:

```text
draft: true
```

to:

```text
draft: false
```

Example frontmatter:

```text
---
title: How I booked a trip to Japan with points
description: The short description used in search and article cards.
date: 2026-11-06
tag: Award Travel
draft: false
---
```

Supported Markdown covers headings, paragraphs, lists, blockquotes, bold, italics, inline code, and links.

## Add a guide

Create another Markdown file in `content/guides/` with the same frontmatter format. Guides appear automatically on `/guides/`.

## Add a downloadable template

1. Put the file in `public/downloads/`.
2. Add the item to `data/templates.json`.

Two examples are included: a card tracker CSV and an award-trip planning checklist.

## Build

```bash
npm run build
```

The complete static site is generated in `dist/`.

If you set a production domain during build, it overrides `data/site.json`:

```bash
SITE_URL=https://reynoldsrestfulgetaways.com npm run build
```

## Deploy on Cloudflare Pages — recommended

1. Create a new GitHub repo and push these files.
2. In Cloudflare Pages, connect the GitHub repo.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable `SITE_URL=https://reynoldsrestfulgetaways.com`.
6. Deploy.
7. Add the custom domain in Cloudflare Pages.
8. Cloudflare will show the DNS record(s) to add for the domain you registered through Squarespace.

## Deploy on GitHub Pages

The repo includes `.github/workflows/deploy-pages.yml`.

1. GitHub repo → **Settings → Pages → Source → GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables**.
3. Add `SITE_URL` with your production URL.
4. Push to `main`.

For a custom domain, add the domain in GitHub Pages settings and then add the requested DNS records at Squarespace.

## Before launch

Replace or review:

- `data/site.json`
- all demo entries in `data/cards.json`
- your About page in `content/pages/about.md`
- disclosure language in `content/pages/disclosure.md`
- privacy and terms pages
- sample posts
- the default OG/social-share image if you want your own branding

## Referral / affiliate compliance

This repository includes disclosure starters, but they are **not legal advice**. Issuers, affiliate networks, and referral programs can have their own required disclosures, trademark rules, offer-display rules, and restrictions on how referral links are promoted. Follow the terms of every program you join and keep card terms/offers current.

A good editorial rule: **always tell readers to compare your referral link with the best public offer available.**

## Folder structure

```text
content/
  posts/        # blog articles in Markdown
  guides/       # evergreen guides in Markdown
  pages/        # about/legal pages
data/
  cards.json
  site.json
  templates.json
public/
  downloads/
  styles.css
  site.js
scripts/
  build.mjs     # static site generator
  dev.mjs       # local preview server
  new-post.mjs
.github/workflows/
  deploy-pages.yml
```

## License

The starter code is MIT licensed. Your articles, original images, referral content, branding, and other site content can remain your copyrighted material.

## Design direction (V2)

The current theme is an editorial travel-journal style: warm cream paper tones, ocean blue, rust accents, large serif headlines, travel imagery, story-first homepage sections, and a separate rewards toolbox for cards, referrals, guides, and templates. The content system remains dependency-free and Markdown/data driven.
