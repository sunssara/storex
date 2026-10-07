import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const require=createRequire(import.meta.url);
const sharp=createRequire(require.resolve('next/package.json'))('sharp');
const partners=JSON.parse(readFileSync('src/lib/partners.json','utf8'));
mkdirSync('public/images/partners/ribbon',{recursive:true});
for(const p of partners){
 const svg=readFileSync('public'+p.image,'utf8');
 const {data,info}=await sharp(Buffer.from(svg)).resize({width:1684}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let x0=info.width,y0=info.height,x1=0,y1=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>0){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
 const scale=841.9/info.width;
 const box=[Math.max(0,x0-2)*scale,Math.max(0,y0-2)*scale,(x1-x0+5)*scale,(y1-y0+5)*scale];
 writeFileSync('public/images/partners/ribbon/'+p.image.split('/').pop(),svg.replace(/viewBox="[^"]+"/,'viewBox="'+box.join(' ')+'"'));
}
console.log('20 SVG copies: only empty viewBox margins trimmed; artwork unchanged.');
