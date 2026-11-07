import fs from 'node:fs';
import path from 'node:path';
const title = process.argv.slice(2).join(' ').trim();
if (!title) { console.error('Usage: npm run new:post -- "Your post title"'); process.exit(1); }
const slug = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');
const file = path.join(process.cwd(),'content/posts',`${slug}.md`);
if (fs.existsSync(file)) { console.error(`Post already exists: ${file}`); process.exit(1); }
const date = new Date().toISOString().slice(0,10);
fs.writeFileSync(file,`---\ntitle: ${title}\ndescription: Add a one-sentence description for search and social previews.\ndate: ${date}\ntag: Draft\ndraft: true\n---\nStart writing here.\n`);
console.log(`Created ${file}`);
