# GitHub staging notes

This folder contains the complete redesigned website. The root project remains the current GitHub Pages site. Work from this directory when editing or building the redesign.

- Current review site: https://reynolds-restful-getaways.kollin-reyno-7892.chatgpt.site
- Consultations are hidden and server-side booking requests are disabled.
- Amazon links are untagged category searches until approved affiliate URLs are supplied.
- Edit recommendations in `lib/content.ts`.
- Contact forms and email capture use Cloudflare D1 and require backend hosting. This is not a drop-in GitHub Pages replacement.
- Do not expose the private inbox outside Sites without equivalent verified authentication.
- No hosting or DNS changes are triggered by this source upload.

# Reynolds Restful Getaways

A responsive, server-rendered travel and rewards consulting website built with React, Vinext, and Cloudflare Workers. Deep navy, warm gold, editorial typography, and original Tokyo photography.

## Main pages

Homepage, consultations, credit cards, guides, travel gear, about, contact, affiliate disclosure, privacy, and terms. `/studio` is the private owner inbox. Older Tokyo story links under `/posts/` remain available.

## Working behavior

- Consultation and contact requests are stored in D1, with server validation, consent, a honeypot, and a per-email cooldown.
- Email subscriptions are stored separately by request type; contact requests do not subscribe visitors.
- `/studio` requires trusted ChatGPT authentication and checks the owner's account user ID on the server. CSV export uses the same check and escapes spreadsheet formula prefixes.
- Card, guide, and gear filters work on small and large screens.
- `/go/:id` resolves only known destinations and records recommendation ID, page placement, and timestamp. No personal form data goes into referral URLs.
- SEO metadata, canonical URLs, social previews, sitemap, robots rules, and a custom 404 page are included.

## Consultation feature switch

`lib/features.ts` sets `features.consultations` to `false`. Consultation navigation, calls to action, and sitemap entries are hidden; direct consultation URLs redirect to guides; both the client form and server submission endpoint block new consultation requests. Existing records are preserved. Change the switch and redeploy only when ready to launch.

## Launch configuration to complete

All editorial content and product lists are in `lib/content.ts`.

1. Confirm the proposed $49 / $99 / $179 consultation rates, durations, deliverables, and cancellation policy. Forms request a session; appointments are confirmed manually by email. No payments or live calendar provider are connected.
2. Add approved Amazon product affiliate URLs. Existing gear links are untagged Amazon searches, clearly identified as such. Update the outbound resolver, link labels, `rel="sponsored nofollow noopener"`, and disclosure together.
3. Add real client testimonials only with permission. Current quotes are from Kollin's Tokyo story and are attributed to him.
4. Connect an email campaign provider if desired. Subscriptions are saved and exportable, but the site does not automatically send campaigns or notification emails.
5. Review disclosure, privacy, and service terms against actual operations before public launch.
6. Change `siteUrl` and canonical URLs if moving to another domain. The existing GitHub Pages domain has not been reconfigured by this build. D1-backed forms require the Worker hosting environment, rather than GitHub Pages static hosting.

## Local work

Run the supplied dependency installer, then `npm run dev` or the Sites preview workflow. Use `npm run db:generate` after schema changes. Apply pending migrations with Wrangler's local D1 execute command using `.wrangler/state`. Production migrations are included in deployment.

The owner account ID is a non-secret authorization identifier, not a credential. The gate relies on trusted hosting authentication headers, not client-supplied identity. A deployment outside Sites must provide an equivalent authenticated identity boundary before exposing `/studio` or `/api/export`.
