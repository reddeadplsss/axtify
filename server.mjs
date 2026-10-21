import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = new URL('./public/', import.meta.url);
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
export const server = createServer(async (req,res)=>{
  try {
    const path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const url = new URL(path === '/' ? 'index.html' : '.'+path, root);
    if (!fileURLToPath(url).startsWith(fileURLToPath(root))) { res.writeHead(403).end(); return; }
    const body = await readFile(url);
    const ext = url.pathname.slice(url.pathname.lastIndexOf('.'));
    res.writeHead(200, {'Content-Type':types[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; media-src 'self' blob:; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'"});res.end(body);
  } catch {res.writeHead(404).end('Not found');}
});
if(process.argv[1] === fileURLToPath(import.meta.url)) server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Axtify: http://localhost:'+(process.env.PORT||4173)));
