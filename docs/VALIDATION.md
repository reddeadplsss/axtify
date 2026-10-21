# Validation

Tested on Linux using Node.js 26.8.2 and local headless Chromium.

- `npm test`: all seven tests pass (filename metadata, playlist/search filtering, queue ending/repeat, shuffle, time formatting, generated WAV structure, HTTP boundaries and headers).
- Browser: original demo plays with advancing time; likes, playlist creation and adding tracks, search, queue display, and library persistence pass.
- Appearance: edit name and accent, save, reload, verify both persist, and restore Axtify/light crimson defaults.
- Desktop 1440×1000 and mobile 390×844 screenshots inspected; no horizontal overflow or page JavaScript errors.

Screenshots show original generated demo content and a test playlist only. Spotify streaming, account integration, all codec/OS combinations, and large-library performance are untested and unimplemented.

## Spotify import and Windows support

- Added four automated tests covering account playlist exports, saved-track exports, unsupported entries, malformed inputs, safe Spotify links, matching to local audio, and repeated imports.
- Browser test covers invalid-file feedback, preview counts, disabled playback for metadata-only entries, Spotify links, repeated import, attaching a local WAV to the existing entry, playback from the imported playlist, reload persistence, and mobile link visibility/no horizontal overflow. Test input is synthetic; no account data is committed.
- CI matrix now runs all eleven tests on Windows and Linux. Windows launcher and README instructions added; native Windows browser/launcher behavior is not directly tested on this Linux machine.
