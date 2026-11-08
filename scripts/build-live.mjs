import './build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const overlay=path.join(root,'redesign-pages');
if(!fs.existsSync(path.join(overlay,'index.html')))throw new Error('Redesigned pages are missing.');
const legacy=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
const modern=fs.readFileSync(path.join(overlay,'sitemap-redesign.xml'),'utf8');
const GA4_ID='G-HQRQBP28EE';
const ga4Tag=`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA4_ID}');
</script>`;
fs.cpSync(overlay,dist,{recursive:true});

function patchHtml(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) patchHtml(full);
    else if(entry.name==='index.html'){
      let html=fs.readFileSync(full,'utf8');
      if(!html.includes(`googletagmanager.com/gtag/js?id=${GA4_ID}`)) html=html.replace('<head>',`<head>${ga4Tag}`);
      html=html
        .replaceAll('Request occasional travel notes by email. Your email app will open so you can send your request.','Enter your email below for occasional travel notes. Your request is sent from this page — no email app required.')
        .replaceAll('This opens an email request; it does not automatically subscribe you.','Your request is submitted here. One successful signup per browser.')
        .replaceAll('Requests are handled manually after you send your email. Unsubscribe by emailing us anytime.','After a successful request, this browser locks the form to reduce repeat submissions. Unsubscribe by emailing us anytime.')
        .replaceAll('This GitHub Pages website does not store form submissions or automatically subscribe you to a newsletter. Contact and newsletter forms prepare an email in your email app. Information is sent only when you choose to send that email. Requests are handled manually by the operator. Please do not include card numbers, passwords, account numbers, or login codes.','Newsletter signup requests are submitted through FormSubmit and forwarded to Reynolds Restful Getaways by email. After a successful signup, this browser stores a small local flag to reduce repeat submissions. Please do not include card numbers, passwords, account numbers, or login codes.')
        .replaceAll('Newsletter requests are handled manually after your email is received.','Newsletter signup requests are forwarded by FormSubmit and handled by the operator.')
        .replaceAll('This site has no advertising pixels, third-party analytics, or on-site click database.','This site uses Google Analytics 4 to understand traffic, page views, engagement, and selected actions such as newsletter signups, referral clicks, affiliate clicks, and downloads. Google may process device, browser, and usage information under its own privacy terms.');
      fs.writeFileSync(full,html);
    }
  }
}
patchHtml(dist);

const jsPath=path.join(dist,'redesign.js');
let js=fs.readFileSync(jsPath,'utf8');
js=js.replace(
  'window.location.href = `mailto:kollin@reynoldsrestfulgetaways.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;',
  "if (newsletter) return; window.location.href = `mailto:kollin@reynoldsrestfulgetaways.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;"
);
js += `\n(() => {
  document.querySelectorAll('form[data-form-kind="newsletter"]').forEach(form => {
    const email=form.querySelector('input[name="email"]');
    const consent=form.querySelector('input[name="consent"]');
    const button=form.querySelector('button[type="submit"]');
    const status=form.querySelector('[role="status"]');
    const doneKey='rrg-newsletter-subscribed-v2';
    const attemptKey='rrg-newsletter-last-attempt-v2';
    const done=()=>{if(email)email.disabled=true;if(consent)consent.disabled=true;if(button){button.disabled=true;button.textContent='Requested ✓'};form.classList.add('is-complete')};
    try{if(localStorage.getItem(doneKey)==='1'){done();if(status)status.textContent='Travel notes already requested from this browser.'}}catch{}
    form.addEventListener('submit',async event=>{
      event.preventDefault(); event.stopImmediatePropagation();
      if(!form.reportValidity())return;
      const data=new FormData(form); if(data.get('website'))return;
      try{
        if(localStorage.getItem(doneKey)==='1'){done();if(status)status.textContent='Travel notes already requested from this browser.';return}
        const last=Number(localStorage.getItem(attemptKey)||0); if(Date.now()-last<30000){if(status)status.textContent='Please wait a moment before trying again.';return}
        localStorage.setItem(attemptKey,String(Date.now()));
      }catch{}
      if(button){button.disabled=true;button.textContent='Sending…'}; if(status)status.textContent='Sending your request…';
      const payload=new FormData();
      payload.set('email',String(data.get('email')||'')); payload.set('consent','yes'); payload.set('source','Reynolds Restful Getaways newsletter');
      payload.set('_subject','New Reynolds Restful Getaways newsletter signup'); payload.set('_template','table'); payload.set('_captcha','false'); payload.set('_honey',String(data.get('website')||'')); payload.set('_url',window.location.href);
      try{
        const response=await fetch('https://formsubmit.co/ajax/kollin@reynoldsrestfulgetaways.com',{method:'POST',headers:{Accept:'application/json'},body:payload});
        const result=await response.json().catch(()=>({})); if(!response.ok||result.success===false)throw new Error('submit failed');
        try{localStorage.setItem(doneKey,'1')}catch{}; done(); if(typeof window.gtag==='function')window.gtag('event','newsletter_signup',{method:'FormSubmit',form_id:'newsletter'}); if(status)status.textContent='Thanks — your travel notes request was received.';
      }catch{if(button){button.disabled=false;button.textContent='Request travel notes'};if(status)status.textContent='I could not submit that request. Please try again in a moment.'}
    },true);
  });
})();\n`;
js += `
(() => {
  const track=(name,params={})=>{if(typeof window.gtag==='function')window.gtag('event',name,params)};
  window.rrgTrack=track;
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href]');
    if(!link)return;
    let url;
    try{url=new URL(link.href,window.location.href)}catch{return}
    const host=url.hostname.replace(/^www\./,'').toLowerCase();
    const common={link_url:url.href,link_text:(link.textContent||'').trim().slice(0,120),page_path:window.location.pathname};
    if(host==='referyourchasecard.com'||host.endsWith('.referyourchasecard.com')) track('chase_referral_click',common);
    if(host==='amazon.com'||host.endsWith('.amazon.com')||host==='amzn.to'||host.endsWith('.amzn.to')) track('amazon_affiliate_click',common);
    const fileName=(url.pathname.split('/').pop()||'').toLowerCase();
    if(link.hasAttribute('download')||/\.(pdf|xlsx?|csv|docx?|pptx?|zip)$/.test(fileName)) track('guide_download',{...common,file_name:fileName});
  },true);
})();
`;
fs.writeFileSync(jsPath,js);
fs.appendFileSync(path.join(dist,'redesign.css'),'\n.capture.is-complete{opacity:.82}.capture.is-complete button{cursor:default}\n');

const urls=new Map();
for(const xml of [legacy,modern])for(const match of xml.matchAll(/<url>.*?<loc>(.*?)<\/loc>.*?<\/url>/gs))urls.set(match[1].replace(/\/$/,''),match[0]);
fs.writeFileSync(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...urls.values()].join('')}</urlset>\n`);
fs.rmSync(path.join(dist,'sitemap-redesign.xml'),{force:true});
console.log('Applied redesigned site; newsletter submits in place.');
