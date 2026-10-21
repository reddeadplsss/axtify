const assets=new Set(['index.html','app.js','core.js','spotify-import.js','style.css']);
exports.CSP="default-src 'self'; script-src 'self'; style-src 'self'; media-src 'self' blob:; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-src 'none'";
exports.assetName=value=>{
 try{const url=new URL(value);if(url.protocol!=='axtify:'||url.hostname!=='app'||url.port||url.username||url.password)return null;const name=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname).slice(1);return assets.has(name)?name:null;}catch{return null;}
};
exports.allowedExternal=value=>{
 try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password||url.port)return false;
 return (url.hostname==='open.spotify.com'&&/^\/track\/[a-zA-Z0-9]{22}$/.test(url.pathname))||
 (url.hostname==='www.spotify.com'&&url.pathname==='/account/privacy/')||
 (url.hostname==='github.com'&&url.pathname==='/reddeadplsss/axtify');
 }catch{return false;}
};
