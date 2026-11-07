# Launch checklist

## 1. Brand configuration
- Site name: **Reynolds Restful Getaways**.
- Domain: `https://reynoldsrestfulgetaways.com`.
- General email: `hello@reynoldsrestfulgetaways.com`.
- Partnership email: `partners@reynoldsrestfulgetaways.com`.
- Edit `data/site.json` if you want to change the tagline, author details, or social links.
- Adjust the colors at the top of `public/styles.css` if desired.

## 2. Replace demo referral cards
- Open `data/cards.json`.
- Delete the three sample cards.
- Add only cards you actually want to feature.
- Paste your real referral URL in `referralUrl`.
- Add a `updated` date whenever you verify the page.
- Compare the referral offer to the issuer's public offer before publishing claims about a bonus.

## 3. Replace starter content
- Rewrite `content/pages/about.md`.
- Review `content/pages/disclosure.md`, `privacy.md`, and `terms.md`.
- Delete or rewrite the three sample posts.
- Keep the two sample guides if useful, or replace them.

## 4. Put the project on GitHub
From the project folder:

```bash
git init
git add .
git commit -m "Initial travel rewards site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## 5. Deploy to Cloudflare Pages
- Create a Cloudflare Pages project from the GitHub repository.
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `SITE_URL=https://reynoldsrestfulgetaways.com`

## 6. Connect the Squarespace-registered domain
- Add the custom domain inside Cloudflare Pages first.
- Cloudflare will show you the exact DNS record(s) it needs.
- In Squarespace Domains, open the domain's DNS settings.
- Add/replace the records Cloudflare instructs you to use.
- Do not transfer the domain away from Squarespace unless you actually want to; registration and hosting can remain separate.

## 7. Test before sharing
- Home page
- Posts index + one post
- Cards index + every referral link
- Guides
- Template downloads
- About
- Disclosure
- Privacy
- Terms
- Mobile layout
- Social-share preview

## 8. Ongoing publishing
Create a post:

```bash
npm run new:post -- "Post title"
```

Write it in `content/posts/`, set `draft: false`, commit, and push. Cloudflare Pages will rebuild automatically.

- [ ] Set up `partners@reynoldsrestfulgetaways.com` for brand and media inquiries.
