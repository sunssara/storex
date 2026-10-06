import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
const root = resolve('out');
const portArg = process.argv.indexOf('--port');
const port = Number(portArg >= 0 ? process.argv[portArg+1] : process.env.PORT || 3001);
if (!existsSync(resolve(root,'index.html'))) { console.error('Run pnpm build first.'); process.exit(1); }
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon'};
createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
  let file=resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  if(existsSync(file)&&statSync(file).isDirectory()){
    if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'+new URL(req.url,'http://localhost').search});res.end();return;}
    file=resolve(file,'index.html');
  }
  const exists=existsSync(file)&&statSync(file).isFile();
  if(!exists)file=resolve(root,'404.html');
  res.writeHead(exists?200:404,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
  if(req.method==='HEAD'){res.end();return;}
  createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Static Storex preview: http://127.0.0.1:${port}/ru/`));
