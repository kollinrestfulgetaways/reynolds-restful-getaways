import { env } from 'cloudflare:workers';
import { features } from '@/lib/features';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 try {
 const origin=request.headers.get('Origin');if(!origin||origin!==new URL(request.url).origin)return json({error:'Please submit this form from the website.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Unsupported form format.'},415);
 const raw=await request.text();if(raw.length>12000)return json({error:'Your message is too long.'},413);
 const b=JSON.parse(raw);if(b.kind==='consultation'&&!features.consultations)return json({error:'Consultation bookings are not currently available.'},403);if(b.website)return json({ok:true});
 if(!['newsletter','consultation','contact'].includes(b.kind)||b.consent!=='yes')return json({error:'Please complete the form and consent checkbox.'},400);
 const email=String(b.email||'').trim().toLowerCase();const name=String(b.name||'').trim();const message=String(b.message||'').trim();
 if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))return json({error:'Please enter a valid email address.'},400);
 if(name.length>120||message.length>3000)return json({error:'Please shorten the name or message.'},400);
 if(b.kind!=='newsletter'&&(!name||!message))return json({error:'Please include your name and message.'},400);
 if(b.kind==='consultation'&&!['foundations','strategy','trip'].includes(b.package))return json({error:'Please select a session.'},400);
 if(!env.DB)return json({error:'The form is temporarily unavailable.'},503);
 const recent=await env.DB.prepare('SELECT id FROM requests WHERE email=? AND kind=? AND created_at>? LIMIT 1').bind(email,b.kind,new Date(Date.now()-60000).toISOString()).first();if(recent)return json({error:'Your recent request is already saved. Please wait a minute before sending another.'},429);
 if(b.kind==='newsletter'){const prior=await env.DB.prepare("SELECT id FROM requests WHERE email=? AND kind='newsletter' LIMIT 1").bind(email).first();if(prior)return json({ok:true});}
 await env.DB.prepare('INSERT INTO requests (kind,name,email,package,message,created_at) VALUES (?,?,?,?,?,?)').bind(b.kind,name,email,b.kind==='consultation'?b.package:'',message,new Date().toISOString()).run();
 return json({ok:true},201);
 }catch{return json({error:'We couldn’t save your request. Please try again.'},500);}
}
