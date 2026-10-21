const {app,BrowserWindow,Menu,protocol,net,shell,session} = require('electron');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {allowedExternal,assetName,CSP} = require('./policy.cjs');
protocol.registerSchemesAsPrivileged([{scheme:'axtify',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
const APP_URL='axtify://app/';
let window;
async function openExternal(url){if(allowedExternal(url))await shell.openExternal(url);}
function createWindow(){
 window=new BrowserWindow({width:1320,height:900,minWidth:390,minHeight:640,title:'Axtify',icon:path.join(__dirname,'..','build','icon.png'),backgroundColor:'#111512',show:false,autoHideMenuBar:true,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,partition:'persist:axtify'}});
 window.once('ready-to-show',()=>window.show());
 window.on('closed',()=>{window=null;});
 window.webContents.setWindowOpenHandler(({url})=>{void openExternal(url);return {action:'deny'};});
 window.webContents.on('will-navigate',(event,url)=>{if(url.split('#')[0]!==APP_URL){event.preventDefault();void openExternal(url);}});
 window.webContents.on('will-attach-webview',event=>event.preventDefault());
 window.loadURL(APP_URL);
}
if(!app.requestSingleInstanceLock())app.quit();
else {
 app.on('second-instance',()=>{if(window){if(window.isMinimized())window.restore();window.focus();}});
 app.whenReady().then(async()=>{
  const ses=session.fromPartition('persist:axtify');
  ses.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
  ses.setPermissionCheckHandler(()=>false);
  ses.protocol.handle('axtify',async request=>{
   const asset=assetName(request.url);
   if(!asset)return new Response('Not found',{status:404});
   const response=await net.fetch(pathToFileURL(path.join(__dirname,'..','public',asset)).href);
   const headers=new Headers(response.headers);headers.set('Content-Security-Policy',CSP);headers.set('X-Content-Type-Options','nosniff');
   return new Response(response.body,{status:response.status,headers});
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate([
   {label:'File',submenu:[{role:'quit'}]},
   {label:'Edit',submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]},
   {label:'View',submenu:[{role:'reload'},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{role:'togglefullscreen'}]},
   {label:'Help',submenu:[{label:'Axtify on GitHub',click:()=>openExternal('https://github.com/reddeadplsss/axtify')}]}
  ]));
  createWindow();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
 }).catch(error=>{console.error('Axtify failed to start:',error);app.quit();});
 app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
}
