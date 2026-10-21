// Reads user-provided Spotify account exports. No Spotify requests or credentials.
const text = value => typeof value === 'string' ? value.trim().slice(0, 300) : '';
export const trackKey = track => `${track.title.trim().toLocaleLowerCase()}\u0000${track.artist.trim().toLocaleLowerCase()}`;
export function spotifyLink(uri) {
  const match = /^spotify:track:([a-zA-Z0-9]{22})$/.exec(uri || '');
  return match ? `https://open.spotify.com/track/${match[1]}` : null;
}
export function parseSpotifyExport(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Choose a Spotify Playlist*.json or YourLibrary.json export.');
  const source = Array.isArray(data.playlists) ? data.playlists : Array.isArray(data.tracks) ? [{name:'Spotify saved tracks',items:data.tracks.map(track=>({track}))}] : null;
  if (!source) throw new Error('No Spotify playlists or saved tracks found in this JSON file.');
  let skipped = 0, count = 0;
  const playlists = source.map(playlist => {
    if (!Array.isArray(playlist?.items)) { skipped++; return null; }
    const seen = new Set();
    const tracks = playlist.items.flatMap(entry => {
      if (++count > 50000) throw new Error('Import up to 50,000 entries at a time.');
      const item = entry?.track;
      const title = text(item?.trackName ?? item?.track);
      const artist = text(item?.artistName ?? item?.artist);
      if (!title || !artist) { skipped++; return []; }
      const uri = spotifyLink(item.trackUri ?? item.uri) ? item.trackUri ?? item.uri : null;
      const track = {title,artist,album:text(item.albumName ?? item.album),spotifyUri:uri};
      const key = uri || trackKey(track);
      if (seen.has(key)) return [];
      seen.add(key); return [track];
    });
    return {name:text(playlist.name) || 'Spotify playlist',tracks};
  }).filter(Boolean);
  if (!playlists.length) throw new Error('No playlists found in this export.');
  return {playlists,skipped};
}
export function mergeSpotifyImport(existingTracks, existingPlaylists, imported, makeId = () => crypto.randomUUID()) {
  const tracks = existingTracks.map(track => ({...track}));
  const playlists = existingPlaylists.map(playlist => ({...playlist,tracks:[...playlist.tracks]}));
  const byUri = new Map(tracks.filter(t=>t.spotifyUri).map(t=>[t.spotifyUri,t]));
  const byName = new Map(tracks.map(t=>[trackKey(t),t]));
  let added = 0, matched = 0;
  for (const list of imported) {
    const ids = list.tracks.map(item => {
      let track = byUri.get(item.spotifyUri) || byName.get(trackKey(item));
      if (!track) {
        track = {...item,id:makeId(),blob:null,liked:false,duration:0};
        tracks.push(track); added++;
      } else { matched++; if (!track.spotifyUri) track.spotifyUri = item.spotifyUri; }
      if(track.spotifyUri) byUri.set(track.spotifyUri,track);
      byName.set(trackKey(track),track);
      return track.id;
    });
    const prior = playlists.find(p=>p.spotifyImport && p.name===list.name);
    if(prior) prior.tracks = [...new Set([...prior.tracks,...ids])];
    else playlists.push({id:makeId(),name:list.name,tracks:[...new Set(ids)],spotifyImport:true});
  }
  return {tracks,playlists,added,matched};
}
