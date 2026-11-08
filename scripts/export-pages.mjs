import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=process.env.RRG_REDESIGN_SOURCE||path.join(root,'redesign');
const output=process.env.RRG_PAGES_OUTPUT||path.join(root,'redesign-pages');
const require=createRequire(path.join(source,'package.json'));
const {build}=createRequire(require.resolve('vite'))('esbuild');
const {renderToStaticMarkup}=require('react-dom/server');
const React=require('react');
const siteUrl='https://reynoldsrestfulgetaways.com';
const temp=path.join(root,'.pages-export');fs.mkdirSync(temp,{recursive:true});fs.mkdirSync(output,{recursive:true});
const staticPrivacy=`{title:'Privacy policy',sections:[['Who operates this website','Kollin Reynolds operates Reynolds Restful Getaways. For privacy questions, contact kollin@reynoldsrestfulgetaways.com.'],['Contact and newsletter requests','This GitHub Pages website does not store form submissions or automatically subscribe you to a newsletter. Contact and newsletter forms prepare an email in your email app. Information is sent only when you choose to send that email. Requests are handled manually by the operator. Please do not include card numbers, passwords, account numbers, or login codes.'],['Email information','If you email us, your address and message are processed by our email provider and used to respond to your request. A general contact message does not subscribe you to marketing. Newsletter requests are handled manually after your email is received.'],['Recommendations and external links','Credit card referral links may contain the referral tracking supplied by the issuer. Amazon links currently open untagged product searches. External websites have their own privacy and cookie practices. This site has no advertising pixels, third-party analytics, or on-site click database.'],['Hosting and fonts','GitHub Pages hosts the site and may process operational request data under its privacy practices. Fonts load from Google Fonts. Your browser requests those resources from their providers.'],['Your choices','You may browse the site without emailing or subscribing. To access, correct, or request deletion of information you emailed, or to unsubscribe from travel notes, email kollin@reynoldsrestfulgetaways.com.'],['Updates','This policy will be updated if the site’s forms, hosting, or email integrations change. Updated November 7, 2026.']]}`;
const plugin={name:'rrg-static-export',setup(b){
 b.onResolve({filter:/^(react(?:\/.*)?|react-dom(?:\/.*)?|lucide-react)$/},args=>({path:require.resolve(args.path),external:true}));
 b.onResolve({filter:/^next\/navigation$/},()=>({path:'navigation',namespace:'static'}));
 b.onLoad({filter:/.*/,namespace:'static'},()=>({contents:`export function usePathname(){return globalThis.__rrgPath||'/'};export function notFound(){throw new Error('PAGE_NOT_FOUND')};export function redirect(to){throw new Error('REDIRECT:'+to)}`,loader:'js'}));
 b.onResolve({filter:/^@\//},args=>({path:resolveSource(args.path.slice(2))}));
 b.onLoad({filter:/\.(tsx|ts)$/},args=>{
  let text=fs.readFileSync(args.path,'utf8');
  if(args.path===path.join(source,'lib/content.ts'))text=text.replace(/export const siteUrl = '[^']+';/,`export const siteUrl = '${siteUrl}';`);
  if(args.path===path.join(source,'components/site.tsx')){
   text=text.replace('<form onSubmit={submit}', '<form data-form-kind={kind} action="mailto:kollin@reynoldsrestfulgetaways.com" method="post" encType="text/plain" onSubmit={submit}');
   text=text.replace('className="guide-card" key={g.slug}', 'className="guide-card" data-category={g.category} key={g.slug}');
   text=text.replace('className="recommendation" key={c.id}', 'className="recommendation" data-category={c.category} key={c.id}');
   text=text.replace('className="gear-card" key={g.id}', 'className="gear-card" data-category={g.category} key={g.id}');
   text=text.replace('Your next trip starts<br/>in your inbox.', 'A little travel inspiration,<br/>by email.');
   text=text.replace('Points made practical. New guides, trip stories, and thoughtful travel notes.', 'Request occasional travel notes by email. Your email app will open so you can send your request.');
   text=text.replace('Occasional emails. Unsubscribe by emailing us anytime.', 'Requests are handled manually after you send your email. Unsubscribe by emailing us anytime.');
   text=text.replace("kind==='newsletter'?'Count me in'", "kind==='newsletter'?'Request travel notes'");
   text=text.replace("'Send message'", "'Prepare email'");
   text=text.replace('<p className="form-status"', '<p className="form-note static-form-note">{kind===\'newsletter\'?\'This opens an email request; it does not automatically subscribe you.\':\'This opens your email app. Your message is sent only after you choose Send there.\'}</p><p className="form-status"');
  }
  if(args.path===path.join(source,'app/[...slug]/page.tsx')){
   text=text.replace(/privacy:\{title:'Privacy policy',sections:\[.*?\]\},\n terms:/s, 'privacy:'+staticPrivacy+',\n terms:');
   text=text.replace('Content does not provide individualized financial, tax, or legal advice.', 'Content does not provide individualized financial, tax, or legal advice.');
   text=text.replace("const titles:Record<string,string>", "const titles:Record<string,string>");
  }
  return {contents:text,loader:args.path.endsWith('.tsx')?'tsx':'ts',resolveDir:path.dirname(args.path)};
 });
}};
function resolveSource(relative){const p=path.join(source,relative);for(const candidate of [p,p+'.tsx',p+'.ts',path.join(p,'index.ts')])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return candidate;throw new Error('Unresolved module '+relative)}
const entry=`export {default as Home} from ${JSON.stringify(path.join(source,'app/page.tsx'))};export {default as Page,generateMetadata} from ${JSON.stringify(path.join(source,'app/[...slug]/page.tsx'))};export {Header,Footer} from ${JSON.stringify(path.join(source,'components/site.tsx'))};export {guides,cards,gear,outbound} from ${JSON.stringify(path.join(source,'lib/content.ts'))};`;
const bundle=path.join(temp,'render.cjs');
await build({stdin:{contents:entry,resolveDir:source,loader:'tsx'},outfile:bundle,bundle:true,platform:'node',format:'cjs',jsx:'automatic',packages:'external',plugins:[plugin],nodePaths:[path.join(source,'node_modules')]});
const app=require(bundle);
const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routes=['/','/cards','/guides','/resources','/shop','/about','/contact','/disclosure','/privacy','/terms','/posts',...app.guides.map(g=>'/guides/'+g.slug),'/posts/tokyo-japan-points-trip'];
const html=(route,body,title,description)=>{
 globalThis.__rrgPath=route;
 const header=renderToStaticMarkup(React.createElement(app.Header));const footer=renderToStaticMarkup(React.createElement(app.Footer));
 const canonical=siteUrl+(route==='/'?'/':route+'/');
 let result=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${siteUrl}/images/tokyo-pagoda.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/redesign.css"><script src="/redesign.js" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a>${header}<main id="main">${body}</main>${footer}</body></html>`;
 result=result.replace(/(?<=(?:src|href)=")\/tokyo-/g,'/images/tokyo-');
 result=result.replace(/href="\/go\/([^?"/]+)(?:\?[^"\s]*)?"/g,(all,id)=>{const url=app.outbound(id);if(!url)throw new Error('Unknown outbound '+id);return `href="${esc(url)}"`;});
 return result;
};
function writeRoute(route,content){const p=path.join(output,route.replace(/^\//,''),'index.html');fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,content)}
for(const route of routes){globalThis.__rrgPath=route;const body=renderToStaticMarkup(route==='/'?React.createElement(app.Home):await app.Page({params:Promise.resolve({slug:route.slice(1).split('/')}),searchParams:Promise.resolve({})}));const meta=route==='/'?{title:'Travel more, pay less — with points',description:'Practical points and miles guides, thoughtful card recommendations, and travel gear from Reynolds Restful Getaways.'}:await app.generateMetadata({params:Promise.resolve({slug:route.slice(1).split('/')})});writeRoute(route,html(route,body,String(meta.title)+' | Reynolds Restful Getaways',String(meta.description)));}
for(const route of ['/consultations','/consultations/booking'])writeRoute(route,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/guides/"><title>Explore our guides</title><link rel="canonical" href="${siteUrl}/guides/"></head><body><p>Explore our <a href="/guides/">free travel guides</a>.</p></body></html>`);
for(const item of [...app.cards,...app.gear]){const url=app.outbound(item.id);writeRoute('/go/'+item.id,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0;url=${esc(url)}"><title>Continue to recommendation</title></head><body><p><a href="${esc(url)}" rel="nofollow noopener">Continue to recommendation</a></p></body></html>`)}
fs.writeFileSync(path.join(output,'redesign.css'),fs.readFileSync(path.join(source,'app/globals.css'),'utf8').replace("@import 'tailwindcss';",'')+'\n[hidden]{display:none!important}.static-form-note{flex:1 1 100%;font-size:10px;line-height:1.7}.capture.compact .static-form-note{order:4;color:#d6e0e4;margin:0!important}.capture.compact .form-status{order:5}\n');
fs.copyFileSync(path.join(source,'public/favicon.svg'),path.join(output,'favicon.svg'));
fs.writeFileSync(path.join(output,'CNAME'),'reynoldsrestfulgetaways.com\n');
fs.writeFileSync(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /studio\nDisallow: /api/\nDisallow: /go/\nSitemap: ${siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(output,'sitemap-redesign.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>!['/resources','/posts/tokyo-japan-points-trip'].includes(r)).map(r=>`<url><loc>${siteUrl}${r==='/'?'/':r+'/'}</loc></url>`).join('')}</urlset>`);
console.log(`Exported ${routes.length} redesigned pages, consultation redirects, and recommendation redirects to ${output}`);
