import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(root, 'data/site.json'), 'utf8'));
const cards = JSON.parse(fs.readFileSync(path.join(root, 'data/cards.json'), 'utf8'));
const templates = JSON.parse(fs.readFileSync(path.join(root, 'data/templates.json'), 'utf8'));
site.url = (process.env.SITE_URL || site.url).replace(/\/$/, '');

const escapeHtml = (value='') => String(value).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stripQuotes = (v) => v.replace(/^['"]|['"]$/g, '');
const storyImages = ['/images/coast.svg','/images/city.svg','/images/hotel.svg'];

function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return [{}, text];
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return [{}, text];
  const raw = text.slice(4, end);
  const body = text.slice(end + 5).trim();
  const meta = {};
  for (const line of raw.split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let value = stripQuotes(line.slice(i + 1).trim());
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    meta[key] = value;
  }
  return [meta, body];
}

function inline(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

function markdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  let html = '', paragraph = [], inList = false, inQuote = false;
  const flushP = () => { if (paragraph.length) { html += `<p>${inline(paragraph.join(' '))}</p>`; paragraph = []; } };
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const closeQuote = () => { if (inQuote) { html += '</blockquote>'; inQuote = false; } };
  for (const line of lines) {
    if (!line.trim()) { flushP(); closeList(); closeQuote(); continue; }
    const h = line.match(/^(#{1,3})\s+(.+)$/);
    if (h) { flushP(); closeList(); closeQuote(); const n = h[1].length; html += `<h${n}>${inline(h[2])}</h${n}>`; continue; }
    const li = line.match(/^[-*]\s+(.+)$/);
    if (li) { flushP(); closeQuote(); if (!inList) { html += '<ul>'; inList = true; } html += `<li>${inline(li[1])}</li>`; continue; }
    const q = line.match(/^>\s?(.*)$/);
    if (q) { flushP(); closeList(); if (!inQuote) { html += '<blockquote>'; inQuote = true; } html += `<p>${inline(q[1])}</p>`; continue; }
    paragraph.push(line.trim());
  }
  flushP(); closeList(); closeQuote();
  return html;
}

function readMarkdownDir(folder) {
  const dir = path.join(root, 'content', folder);
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const [meta, body] = parseFrontmatter(raw);
    return { ...meta, body, html: markdown(body), slug: file.replace(/\.md$/, '') };
  });
}

function header() {
  return `<div class="utility-bar"><div class="container utility-inner"><span>TRAVEL STORIES</span><span>POINTS & MILES</span><span>SMARTER CARD REWARDS</span></div></div><header class="site-header"><div class="container nav-wrap"><a class="brand" href="/"><span class="brand-mark">⌁</span><span class="brand-text"><strong>${escapeHtml(site.name)}</strong><small>${escapeHtml(site.tagline)}</small></span></a><button class="menu-button" aria-label="Toggle navigation" data-menu-button>Menu</button><nav class="site-nav" aria-label="Primary navigation" data-menu><a href="/posts/">Travel Journal</a><a href="/guides/">Guides</a><a href="/cards/">Cards</a><a href="/templates/">Freebies</a><a href="/work-with-me/">Work With Me</a><a href="/about/">About</a></nav></div></header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `<footer><div class="container footer-grid"><div class="footer-brand"><div class="brand footer-logo"><span class="brand-mark">⌁</span><span class="brand-text"><strong>${escapeHtml(site.name)}</strong><small>${escapeHtml(site.tagline)}</small></span></div><p>Travel stories, award-booking lessons, card strategy, and practical tools for getting more out of every trip.</p></div><div><strong>Explore</strong><a href="/posts/">Travel Journal</a><a href="/guides/">Guides</a><a href="/cards/">Card referrals</a><a href="/templates/">Templates</a><a href="/work-with-me/">Work With Me</a></div><div><strong>Legal</strong><a href="/disclosure/">Referral disclosure</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></div></div><div class="container fineprint"><p>Some links may be referral or affiliate links. I may receive compensation if you use them, at no extra cost to you.</p><p>© ${year} ${escapeHtml(site.name)}. Educational content only; not financial, tax, or legal advice.</p></div></footer>`;
}

function page({ title=site.name, description=site.description, pathname='/', body, noindex=false }) {
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  const canonical = `${site.url}${pathname}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(fullTitle)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(canonical)}">${noindex?'<meta name="robots" content="noindex,nofollow">':''}<meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(fullTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${site.url}/og-default.svg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/styles.css"><link rel="alternate" type="application/rss+xml" title="${escapeHtml(site.name)} RSS" href="/rss.xml"><script defer src="/site.js"></script></head><body>${header()}<main>${body}</main>${footer()}</body></html>`;
}

function writeRoute(route, html) {
  const clean = route.replace(/^\//,'').replace(/\/$/,'');
  const dir = path.join(dist, clean);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

function formatDate(date) { return new Intl.DateTimeFormat('en-US',{dateStyle:'medium'}).format(new Date(`${date}T12:00:00`)); }
function imgFor(item, index=0) { if (item.image) return item.image; return storyImages[index % storyImages.length]; }

function postCard(post, index=0, large=false) {
  return `<article class="story-card${large?' story-card-large':''}"><a class="story-image" href="/posts/${post.slug}/"><img src="${imgFor(post,index)}" alt="" loading="lazy"></a><div class="story-content"><div class="story-meta"><span>${escapeHtml(post.tag||'Travel')}</span><time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time></div><h3><a href="/posts/${post.slug}/">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.description)}</p><a class="text-link" href="/posts/${post.slug}/">Read the story <span>→</span></a></div></article>`;
}

function cardTile(card) {
  const referral = card.referralUrl && card.referralUrl !== '#' ? `<a class="btn btn-dark" target="_blank" rel="sponsored nofollow noopener" href="${escapeHtml(card.referralUrl)}">${escapeHtml(card.referralLabel||'View referral offer')}</a>`:'';
  return `<article class="reward-card"><div class="reward-card-top"><span class="category-label">${escapeHtml(card.category)}</span><span class="fee">${escapeHtml(card.annualFee)} fee</span></div><h3><a href="/cards/${escapeHtml(card.slug)}/">${escapeHtml(card.name)}</a></h3><p class="issuer">${escapeHtml(card.issuer)}</p><p>${escapeHtml(card.rewardSummary)}</p><div class="best-for"><span>Best for</span><strong>${escapeHtml(card.bestFor)}</strong></div><div class="card-actions"><a class="btn btn-outline" href="/cards/${escapeHtml(card.slug)}/">My notes</a>${referral}</div></article>`;
}

function articlePage(item, pathname, includeDisclosure=true, image='/images/airplane.svg') {
  const backHref = pathname.startsWith('/guides/') ? '/guides/' : '/posts/';
  const backLabel = pathname.startsWith('/guides/') ? 'All guides' : 'Travel Journal';
  const disclosure = includeDisclosure && item.disclosure !== false ? `<div class="editor-note"><strong>Disclosure</strong><p>Some links may be referral or affiliate links. Offers and terms can change, so verify details with the issuer before applying.</p></div>`:'';
  return page({title:item.title,description:item.description,pathname,body:`<article class="article-page"><div class="container article-header"><a class="back" href="${backHref}">← ${backLabel}</a><div class="article-kicker">${escapeHtml(item.tag||'Travel & rewards')}</div><h1>${escapeHtml(item.title)}</h1><p class="dek">${escapeHtml(item.description||'')}</p>${item.date?`<div class="byline">By ${escapeHtml(site.author)} · <time datetime="${escapeHtml(item.date)}">${formatDate(item.date)}</time></div>`:''}</div><div class="container article-hero"><img src="${image}" alt=""></div><div class="container article-layout"><div class="prose">${disclosure}${item.html}</div><aside class="article-aside"><span class="eyebrow">Travel smarter</span><h3>Plan the trip. Then choose the points.</h3><p>Start with where you want to go and work backward to the miles, cards, and transfer partners that make sense.</p><a class="text-link" href="/guides/">Browse guides →</a></aside></div></article>`});
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root,'public'), dist, { recursive: true });

const posts = readMarkdownDir('posts').filter(p => p.draft !== true).sort((a,b)=>new Date(b.date)-new Date(a.date));
const guides = readMarkdownDir('guides').sort((a,b)=>new Date(b.date)-new Date(a.date));
const pages = readMarkdownDir('pages');
const leadPost = posts[0];

const home = `<section class="home-hero"><div class="container hero-layout"><div class="hero-photo"><img src="/images/airplane.svg" alt="Illustrated airplane wing above the clouds"><div class="photo-caption">Window seat notes · points, miles & better trips</div></div><div class="hero-copy"><span class="eyebrow">A travel journal with a rewards strategy</span><h1>See more of the world without making travel feel like homework.</h1><p>I share trip stories, points-and-miles lessons, the cards I actually use, referral links, and the simple templates that keep everything organized.</p><div class="actions"><a class="btn btn-dark" href="/posts/">Read the travel journal</a><a class="btn btn-outline" href="/guides/">Start with the guides</a></div><div class="passport-note"><span>✦</span><div><strong>Travel first. Rewards second.</strong><small>The goal is a better trip — not collecting points for the sake of points.</small></div></div></div></div></section>
<section class="section featured-story"><div class="container"><div class="section-heading"><div><span class="eyebrow">Featured story</span><h2>${escapeHtml(leadPost?.title||'Latest from the road')}</h2></div><a class="text-link" href="/posts/">All stories →</a></div>${leadPost?`<div class="feature-grid"><a class="feature-image" href="/posts/${leadPost.slug}/"><img src="/images/coast.svg" alt=""></a><div class="feature-copy"><div class="story-meta"><span>${escapeHtml(leadPost.tag||'Travel')}</span><time>${formatDate(leadPost.date)}</time></div><p class="feature-dek">${escapeHtml(leadPost.description)}</p><div class="mini-list"><div><strong>Trip planning</strong><span>Start with a destination and work backward.</span></div><div><strong>Points strategy</strong><span>Earn currencies you have a reason to use.</span></div><div><strong>Real numbers</strong><span>Track fees, taxes, and the value you actually receive.</span></div></div><a class="btn btn-dark" href="/posts/${leadPost.slug}/">Read this story</a></div></div>`:''}</div></section>
<section class="section latest-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">From the journal</span><h2>Trips, bookings & lessons learned</h2></div><a class="text-link" href="/posts/">See everything →</a></div><div class="story-grid">${posts.slice(0,3).map((p,i)=>postCard(p,i)).join('')}</div></div></section>
<section class="section toolbox-section"><div class="container toolbox-grid"><div class="toolbox-intro"><span class="eyebrow">The rewards toolbox</span><h2>Everything behind the trip.</h2><p>The travel stories are the fun part. This is where I keep the practical pieces: card notes, referral offers, booking guides, and free trackers.</p></div><div class="tool-grid"><a class="tool-card" href="/cards/"><span class="tool-number">01</span><strong>Cards & referrals</strong><p>What I use, who each card fits, fees, practical notes, and clearly disclosed referral links.</p><span>Browse cards →</span></a><a class="tool-card" href="/guides/"><span class="tool-number">02</span><strong>Points guides</strong><p>Step-by-step help for getting started, transferring rewards, and planning award travel.</p><span>Learn the system →</span></a><a class="tool-card" href="/templates/"><span class="tool-number">03</span><strong>Free templates</strong><p>Card trackers, award trip planning sheets, checklists, and other tools you can download.</p><span>Get the freebies →</span></a></div></div></section>
<section class="section card-preview"><div class="container"><div class="section-heading"><div><span class="eyebrow">In my wallet</span><h2>Cards worth understanding</h2></div><a class="text-link" href="/cards/">Full card library →</a></div><div class="reward-grid">${cards.filter(c=>c.featured).map(cardTile).join('')}</div><p class="disclosure">Referral disclosure: I may receive a bonus if you apply through certain links. Always compare my link with the best public offer available.</p></div></section>
<section class="section partnership-teaser"><div class="container partnership-teaser-grid"><div><span class="eyebrow">Brand partnerships</span><h2>Have a stay, destination, or travel product worth sharing?</h2><p>I work with travel brands on thoughtful editorial coverage, hosted stays, destination campaigns, UGC, and other partnerships that fit Reynolds Restful Getaways readers.</p></div><div class="partnership-teaser-actions"><a class="btn btn-dark" href="/work-with-me/">Work with me</a><a class="text-link" href="mailto:${escapeHtml(site.partnersEmail)}?subject=Partnership%20inquiry">${escapeHtml(site.partnersEmail)} <span>-></span></a></div></div></section>
<section class="section newsletter-section"><div class="container newsletter"><div><span class="eyebrow">Postcards to your inbox</span><h2>New trips, useful points notes, and fresh templates.</h2><p>No daily deal spam. Just the things I’d want saved before planning another trip.</p></div><a class="btn btn-dark" href="mailto:${escapeHtml(site.email)}?subject=Newsletter%20signup">Join the list</a></div></section>`;
writeRoute('/', page({body:home,pathname:'/'}));

writeRoute('/posts/', page({title:'Travel Journal',description:'Trip stories, award travel, card strategy, and points lessons.',pathname:'/posts/',body:`<section class="page-intro"><div class="container intro-grid"><div><span class="eyebrow">Travel Journal</span><h1>Trips first. Points second.</h1><p>Destination notes, award bookings, route ideas, and the practical rewards strategy behind the trip.</p></div><div class="intro-image"><img src="/images/city.svg" alt=""></div></div></section><section class="section"><div class="container story-grid">${posts.map((p,i)=>postCard(p,i)).join('')}</div></section>`}));
for (const [i,post] of posts.entries()) writeRoute(`/posts/${post.slug}/`, articlePage(post, `/posts/${post.slug}/`, true, imgFor(post,i)));

const categories = ['All', ...new Set(cards.map(c=>c.category))];
writeRoute('/cards/', page({title:'Cards & referrals',description:'Cards I use or recommend, with transparent notes and referral disclosures.',pathname:'/cards/',body:`<section class="page-intro card-intro"><div class="container intro-grid"><div><span class="eyebrow">Cards & referrals</span><h1>The card side of the travel plan.</h1><p>I keep this section separate from the travel journal so you can quickly compare fees, use cases, and my notes without digging through trip posts.</p></div><div class="intro-stamp"><strong>COMPARE<br>BEFORE<br>APPLYING</strong><span>Offers change</span></div></div></section><section class="section"><div class="container"><div class="notice-strip"><strong>Referral disclosure:</strong> I may receive a bonus if you use certain links. A referral offer is not automatically the best offer, so compare it with the issuer’s public page first.</div><div class="filters" role="group" aria-label="Filter cards">${categories.map((c,i)=>`<button class="filter${i===0?' active':''}" data-filter="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div><div class="reward-grid">${cards.map(c=>`<div data-category="${escapeHtml(c.category)}">${cardTile(c)}</div>`).join('')}</div></div></section>`}));
for (const card of cards) {
  const cta = card.referralUrl && card.referralUrl !== '#' ? `<p><a class="btn btn-dark" target="_blank" rel="sponsored nofollow noopener" href="${escapeHtml(card.referralUrl)}">${escapeHtml(card.referralLabel||'View referral offer')} ↗</a></p>` : `<div class="editor-note"><strong>Demo listing</strong><p>Add your referral URL in <code>data/cards.json</code> before publishing this button.</p></div>`;
  writeRoute(`/cards/${card.slug}/`, page({title:card.name,description:card.rewardSummary,pathname:`/cards/${card.slug}/`,body:`<section class="card-detail"><div class="container card-detail-grid"><div><a class="back" href="/cards/">← All cards</a><span class="category-label">${escapeHtml(card.category)}</span><h1>${escapeHtml(card.name)}</h1><p class="dek">${escapeHtml(card.rewardSummary)}</p><div class="card-facts"><div><span>Issuer</span><strong>${escapeHtml(card.issuer)}</strong></div><div><span>Annual fee</span><strong>${escapeHtml(card.annualFee)}</strong></div><div><span>Best for</span><strong>${escapeHtml(card.bestFor)}</strong></div><div><span>Last reviewed</span><strong>${escapeHtml(card.updated)}</strong></div></div>${cta}</div><aside class="card-note-box"><span class="eyebrow">My take</span><h2>Why it’s here</h2><ul>${card.notes.map(n=>`<li>${escapeHtml(n)}</li>`).join('')}</ul><div class="notice-strip"><strong>Before you apply:</strong> Check the issuer’s current terms, eligibility rules, bonus, annual fee, and benefits.</div></aside></div></section>`}));
}

writeRoute('/guides/', page({title:'Guides',description:'Step-by-step travel rewards and credit card guides.',pathname:'/guides/',body:`<section class="page-intro"><div class="container intro-grid"><div><span class="eyebrow">Guides</span><h1>The practical side of points and miles.</h1><p>Evergreen resources you can bookmark when you’re planning a trip, evaluating a card, or trying to understand a transfer partner.</p></div><div class="intro-image"><img src="/images/hotel.svg" alt=""></div></div></section><section class="section"><div class="container guide-grid">${guides.map((g,i)=>`<article class="guide-card"><span>Guide ${String(i+1).padStart(2,'0')}</span><h3><a href="/guides/${g.slug}/">${escapeHtml(g.title)}</a></h3><p>${escapeHtml(g.description)}</p><a class="text-link" href="/guides/${g.slug}/">Open guide →</a></article>`).join('')}</div></section>`}));
for (const [i,guide] of guides.entries()) writeRoute(`/guides/${guide.slug}/`, articlePage(guide, `/guides/${guide.slug}/`, guide.disclosure !== false, storyImages[(i+1)%storyImages.length]));

writeRoute('/templates/', page({title:'Free templates',description:'Free travel rewards trackers, checklists, and planning templates.',pathname:'/templates/',body:`<section class="page-intro"><div class="container intro-grid"><div><span class="eyebrow">Free downloads</span><h1>The spreadsheets and checklists behind the trips.</h1><p>Simple files you can copy, customize, and use to track cards, annual fees, benefits, award searches, and trip plans.</p></div><div class="intro-stamp download-stamp"><strong>FREE<br>TRAVEL<br>TOOLS</strong><span>Download & customize</span></div></div></section><section class="section"><div class="container template-grid">${templates.map(t=>`<article class="template-card"><span class="format">${escapeHtml(t.format)}</span><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.description)}</p><a class="btn btn-dark" href="${escapeHtml(t.href)}" download>Download</a></article>`).join('')}</div></section>`}));

const workWithMe = `<section class="partnership-hero"><div class="container partnership-hero-grid"><div><span class="eyebrow">Work with Reynolds Restful Getaways</span><h1>Travel partnerships with a story worth telling.</h1><p class="partnership-lead">Reynolds Restful Getaways is an independent travel publication focused on practical trip planning, memorable stays, and the points-and-rewards strategy that can make those trips possible.</p><div class="actions"><a class="btn btn-dark" href="mailto:${escapeHtml(site.partnersEmail)}?subject=Partnership%20inquiry">Start a conversation</a><a class="btn btn-outline" href="#media-kit">Media kit</a></div></div><div class="partnership-stamp"><span>RRG</span><strong>TRAVEL<br>STORIES<br>WITH PURPOSE</strong><small>Editorial + creator partnerships</small></div></div></section>
<section class="section partnership-intro"><div class="container partnership-split"><div><span class="eyebrow">A good fit looks like</span><h2>Useful for readers. Useful for brands. Honest about both.</h2></div><div><p>I am interested in partnerships that naturally fit the trips, guides, and travel-planning content on this site. That can mean introducing readers to a distinctive place to stay, showing how a travel product works in the real world, or creating polished content a brand can use on its own channels.</p><p>Hosted, gifted, affiliate, and paid relationships are disclosed clearly. Editorial opinions remain my own, and I do not promise positive reviews in exchange for compensation.</p></div></div></section>
<section class="section partnership-services"><div class="container"><div class="section-heading"><div><span class="eyebrow">Ways to collaborate</span><h2>Partnerships built around real travel.</h2></div></div><div class="service-grid"><article class="service-card"><span>01</span><h3>Hosted stays & destination coverage</h3><p>Hotel, resort, cabin, tourism-board, and destination coverage woven into useful itineraries, trip reports, and travel guides.</p></article><article class="service-card"><span>02</span><h3>Sponsored editorial</h3><p>Clearly disclosed sponsored articles or integrations built around a topic that genuinely serves Reynolds Restful Getaways readers.</p></article><article class="service-card"><span>03</span><h3>UGC, photo & video</h3><p>Original travel photography and short-form vertical content created for a brand's own website, social channels, or campaigns. Usage rights can be scoped separately.</p></article><article class="service-card"><span>04</span><h3>Affiliate partnerships</h3><p>Longer-term partnerships with travel products, booking tools, services, and brands that make sense for the site's audience and content.</p></article><article class="service-card"><span>05</span><h3>Newsletter & site placements</h3><p>Future newsletter sponsorships, featured resources, and tasteful site placements as the Reynolds Restful Getaways audience grows.</p></article><article class="service-card"><span>06</span><h3>Custom campaign ideas</h3><p>Have a launch, property, route, or destination that needs a different approach? I am happy to shape deliverables around a specific campaign.</p></article></div></div></section>
<section class="section media-kit-section" id="media-kit"><div class="container media-kit-grid"><div class="media-kit-copy"><span class="eyebrow">Media kit</span><h2>The essentials, without inflated numbers.</h2><p>Reynolds Restful Getaways is still building its audience, so the media kit is designed to grow with the publication. I would rather share current analytics and relevant examples than publish vanity metrics that are out of date.</p><div class="media-kit-facts"><div><span>Publication</span><strong>${escapeHtml(site.name)}</strong></div><div><span>Creator</span><strong>${escapeHtml(site.author)}</strong></div><div><span>Focus</span><strong>Travel, hotels, points, miles & practical trip planning</strong></div><div><span>Partnership contact</span><strong><a href="mailto:${escapeHtml(site.partnersEmail)}">${escapeHtml(site.partnersEmail)}</a></strong></div></div></div><aside class="media-kit-card"><span class="eyebrow">Available for pitches</span><h3>Current media-kit materials</h3><ul><li>Publication and creator overview</li><li>Content focus and partnership formats</li><li>Selected article examples</li><li>Current website and social analytics when available</li><li>Proposed campaign deliverables</li><li>Usage-rights and licensing discussion</li></ul><a class="btn btn-dark" href="mailto:${escapeHtml(site.partnersEmail)}?subject=Reynolds%20Restful%20Getaways%20media%20kit">Request the media kit</a></aside></div></section>
<section class="section partnership-process"><div class="container"><div class="section-heading"><div><span class="eyebrow">How it works</span><h2>From idea to published story.</h2></div></div><div class="process-grid"><div><span>01</span><strong>Tell me about the fit</strong><p>Share the destination, property, product, timing, campaign goal, and any deliverables you already have in mind.</p></div><div><span>02</span><strong>Shape the collaboration</strong><p>We agree on deliverables, dates, compensation or hosted elements, disclosure, usage rights, and any review process.</p></div><div><span>03</span><strong>Create & travel</strong><p>I capture the experience and build content around what is genuinely useful or interesting for the audience.</p></div><div><span>04</span><strong>Publish & report</strong><p>The agreed content goes live, and campaign results can be shared when analytics are available.</p></div></div></div></section>
<section class="partnership-cta"><div class="container partnership-cta-inner"><div><span class="eyebrow">Let's plan something useful</span><h2>Have a trip, property, or travel brand in mind?</h2><p>Send a short note with the brand, destination or product, proposed dates, and what you would like to create together.</p></div><div><a class="btn btn-dark" href="mailto:${escapeHtml(site.partnersEmail)}?subject=Partnership%20inquiry">Email ${escapeHtml(site.partnersEmail)}</a></div></div></section>`;
writeRoute('/work-with-me/', page({title:'Work With Me',description:'Brand partnerships, hosted travel, sponsored editorial, UGC, affiliate collaborations, and media-kit information for Reynolds Restful Getaways.',pathname:'/work-with-me/',body:workWithMe}));

for (const item of pages) writeRoute(`/${item.slug}/`, page({title:item.title,description:item.description||site.description,pathname:`/${item.slug}/`,body:`<section class="simple-page"><article class="container prose simple-prose"><span class="eyebrow">${item.slug==='about'?'About this site':'Site information'}</span><h1>${escapeHtml(item.title)}</h1>${item.html}${item.slug==='about'?`<h2>Contact</h2><p>Email <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>.</p>`:''}</article></section>`}));

writeRoute('/404/', page({title:'Page not found',description:'Page not found',pathname:'/404/',noindex:true,body:`<section class="simple-page"><div class="container prose simple-prose"><span class="eyebrow">404</span><h1>Wrong turn.</h1><p>This route didn’t make the itinerary.</p><a class="btn btn-dark" href="/">Back home</a></div></section>`}));
fs.copyFileSync(path.join(dist,'404','index.html'), path.join(dist,'404.html'));

const urls = ['/', '/posts/', ...posts.map(p=>`/posts/${p.slug}/`), '/cards/', ...cards.map(c=>`/cards/${c.slug}/`), '/guides/', ...guides.map(g=>`/guides/${g.slug}/`), '/templates/', '/work-with-me/', ...pages.map(p=>`/${p.slug}/`)];
fs.writeFileSync(path.join(dist,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${site.url}${u}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(dist,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist,'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${escapeHtml(site.name)}</title><link>${site.url}</link><description>${escapeHtml(site.description)}</description>${posts.map(p=>`<item><title>${escapeHtml(p.title)}</title><link>${site.url}/posts/${p.slug}/</link><guid>${site.url}/posts/${p.slug}/</guid><pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate><description>${escapeHtml(p.description)}</description></item>`).join('')}</channel></rss>`);

console.log(`Built ${urls.length} routes into ${dist}`);
