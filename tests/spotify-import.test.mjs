import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSpotifyExport,mergeSpotifyImport,spotifyLink} from '../public/spotify-import.js';
const uri='spotify:track:1234567890123456789012';
const track={trackName:'First light',artistName:'Axtify',trackUri:uri};
test('reads account playlist exports; skips episodes and duplicates',()=>{
 const data=parseSpotifyExport({playlists:[{name:'Favorites',items:[{track},{episode:{episodeName:'Podcast'}},{track}]}]});
 assert.equal(data.playlists[0].name,'Favorites');assert.equal(data.playlists[0].tracks.length,1);assert.equal(data.skipped,1);
 assert.equal(data.playlists[0].tracks[0].spotifyUri,uri);
});
test('reads YourLibrary export and preserves missing Spotify links',()=>{
 const parsed=parseSpotifyExport({tracks:[{track:'Song',artist:'Artist',album:'Album',uri}]});
 assert.equal(parsed.playlists[0].name,'Spotify saved tracks');assert.equal(parsed.playlists[0].tracks[0].title,'Song');
 assert.equal(parseSpotifyExport({playlists:[{items:[{track:{...track,trackUri:'javascript:alert(1)'}}]}]}).playlists[0].tracks[0].spotifyUri,null);
 assert.equal(spotifyLink(uri),'https://open.spotify.com/track/1234567890123456789012');assert.equal(spotifyLink('https://evil.example'),null);
});
test('rejects unrelated files; handles null playlist items without crashing',()=>{
 for(const input of [null,[],{}, {history:[]}])assert.throws(()=>parseSpotifyExport(input));
 assert.equal(parseSpotifyExport({playlists:[{items:[null,{track:null}]}]}).skipped,2);
});
test('merges into local audio by normalized title and artist and reimports idempotently',()=>{
 let n=0;const id=()=>String(++n);
 const local={id:'local',title:'FIRST LIGHT',artist:'axtify',blob:new Blob(['test']),liked:true};
 const imported=parseSpotifyExport({playlists:[{name:'Favorites',items:[{track},{track:{trackName:'Missing',artistName:'Artist'}}]}]}).playlists;
 const result=mergeSpotifyImport([local],[],imported,id);
 assert.equal(result.added,1);assert.equal(result.matched,1);assert.equal(result.tracks[0].blob,local.blob);assert.equal(result.tracks[0].liked,true);assert.equal(local.spotifyUri,undefined);
 assert.deepEqual(result.playlists[0].tracks,['local','1']);assert.equal(result.tracks[1].blob,null);
 const again=mergeSpotifyImport(result.tracks,result.playlists,imported,id);assert.equal(again.tracks.length,2);assert.equal(again.playlists.length,1);assert.deepEqual(again.playlists[0].tracks,['local','1']);
});
