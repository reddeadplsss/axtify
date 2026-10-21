# Axtify

An independent, open-source music player for your own audio collection. Spotify's local-files interface was studied with REA to inform the project; all app code, visual design, and the included synthesized demo are original.

![Axtify desktop](docs/desktop.png)

## Run

Requires Node.js 22 or later. No dependencies or API keys.

```sh
npm start
```

Open http://localhost:4173. Use `PORT=5000 npm start` for another port. Keep the same port to keep the same browser library: storage is scoped to the origin.

## Customize

Click **Customize** in the header to change the app name, accent, and background. Defaults: Axtify with light crimson (`#f08090`). Settings persist on this browser.

## Listen

- Import audio files or drag them into the window. `Artist - Title.mp3` filenames populate artist and title; other names use “Local artist.” Tags and embedded artwork are not parsed.
- Play **First light** to hear an original 24-second synthesized ambient sketch.
- Search by title or artist; press `/` to focus search and Space to play/pause outside form fields.
- Like tracks, create named playlists, and use the `+` beside a track to add it to a playlist.
- Play all builds a queue from the current view. Use next, previous, shuffle, repeat, seek, volume, and queue selection.

Audio blobs, likes, and playlists persist in IndexedDB on this browser/device. There is no upload, telemetry, external font, account, or external network dependency. Browser storage limits apply; clearing site data removes the library. Keep original audio files backed up. Audio format support depends on your browser. Desktop and mobile layouts are included.

## Development

```sh
npm test
```

`public/` contains the plain JavaScript app, stylesheet, and HTML. `server.mjs` is a loopback-only static server. Tests cover filtering, queue behavior, filename parsing, generated WAV integrity, and HTTP serving boundaries. Browser checks and their limits are recorded in `docs/VALIDATION.md`.

See [research notes](docs/RESEARCH.md) for evidence, scope, and open questions. This is a standalone local music player, with no Spotify streaming, login, catalog, or DRM implementation. It is not affiliated with Spotify. No Spotify binaries, source bundles, fonts, artwork, or audio are redistributed.

## License

MIT. Contributions welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).
