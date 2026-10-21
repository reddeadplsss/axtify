import test from 'node:test';
import assert from 'node:assert/strict';
import {metadata,selectTracks,nextIndex,time,demoWav} from '../public/core.js';
test('import names retain artist and title with multiple separators',()=>{assert.deepEqual(metadata('Artist - A - B.flac'),{artist:'Artist',title:'A - B'});assert.equal(metadata('Solo.mp3').title,'Solo');});
test('playlist membership, liked state and search combine',()=>{const tracks=[{id:'1',title:'Morning',artist:'Mira',liked:true},{id:'2',title:'Night',artist:'Other',liked:false}];assert.deepEqual(selectTracks(tracks,'p','mIRA',[{id:'p',tracks:['1','2']}]).map(t=>t.id),['1']);assert.equal(selectTracks(tracks,'liked','night',[]).length,0);assert.equal(selectTracks(tracks,'missing','',[]).length,0);});
test('queue stops at natural end unless repeated; manual next wraps',()=>{assert.equal(nextIndex(1,2,{ended:true}),-1);assert.equal(nextIndex(1,2,{ended:true,repeat:true}),0);assert.equal(nextIndex(1,2),0);assert.equal(nextIndex(0,0),-1);});
test('shuffle avoids current track, including at each boundary',()=>{for(let i=0;i<4;i++)for(const r of [0,.3,.6,.999]){const n=nextIndex(i,4,{shuffle:true,random:()=>r});assert.notEqual(n,i);assert.ok(n>=0&&n<4);}});
test('time formats loading, invalid and minute boundaries',()=>{assert.equal(time(Infinity),'0:00');assert.equal(time(-1),'0:00');assert.equal(time(125.8),'2:05');});
test('original demo is a valid 24-second mono PCM WAV',async()=>{const blob=demoWav();const bytes=await blob.arrayBuffer();const v=new DataView(bytes);assert.equal(new TextDecoder().decode(bytes.slice(0,4)),'RIFF');assert.equal(v.getUint32(24,true),22050);assert.equal(v.getUint32(40,true),24*22050*2);assert.equal(bytes.byteLength,44+24*22050*2);});
