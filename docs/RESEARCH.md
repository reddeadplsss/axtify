# Research and reconstruction boundary

## Target and method

Spotify Linux client 1.2.95.453.g0eeebbed, extracted XPUI directory. Static REA analysis on 2026-10-20 selected `index.html`, `xpui-routes-health-check.js`, and `xpui-routes-collection-local-files.js`. Application code was parsed as inert text, never executed. No account or traffic data was accessed.

The previously saved report and local-files observations were reused, then the selected analysis was repeated because its earlier Evidence reference was no longer retained in the new session.

- Current analysis parent: `ev_048a60b3cf0c770b8c04c8304d6cfb3f348bc1355182b19378cc59aeb29e4e62`
- Summary Evidence: `ev_7463b754c616c5b8219d8fde0899098a11b4485c86d9894d35245c830481c745`
- Extracted-tree SHA-256: `d64947de53ae7c16cd1c166593457924e3b922503142091b1850b8b8a5b357eb`
- Official package SHA-256 recorded in the prior report: `256e2eb1ec96fbc0c51afab247298e4e6eabfabbafafd4617584f44cca2fb31f`

## Finding ledger

| Question | Evidence and observation | Conclusion / limit |
| --- | --- | --- |
| UI packaging | index.html and extracted package inventory: snapshot JavaScript/CSS, chunk files; native executable and libcef in the prior package report | Native shell with Chromium-rendered UI is supported; native internals remain unexamined. |
| Local-files flow | Route at character offset 11100, recorded in prior local-files observations: local-files query calls getTracks, uses staleTime 0 and gcTime 300000, maps results into playback context items | Static track-list to playback-item mapping observed; service implementations and runtime execution unknown. |
| Enabled-state lifecycle | Route near offset 13321: reads enabled state, subscribes and cleans up, exposes an enabled setter | Static subscription lifecycle observed; actual account feature availability unknown. |
| Source coverage | Current REA summary: 248 relevant inventoried files, 2 JS parsed, 9 modules, 0 parse failures, 245 files outside selected source analysis, 3472 semantic unknowns | Partial application and semantic coverage. No global equivalence claim. |

## Original implementation choices

Axtify uses an explicit imported audio library, HTMLAudioElement playback, IndexedDB persistence, queue IDs, likes, search, and named playlists. Its colors, layout, artwork, demo synthesizer, persistence design, and queue policy are independent design choices. These are not recovered Spotify source or proven matches to Spotify behavior.

Completed: bounded packaging and local-files study; independent local player implementation. Unresolved: native playback/authentication, DRM, streaming protocol, service implementations in unselected chunks, live behavior, and exhaustive UI parity. None are necessary for this local-only app. The app does not claim to be a compatible Spotify client.

Only research summaries are included. Proprietary analyzed artifacts and raw evidence bundles are intentionally excluded from the repository.

## Axtify verification pass

A fresh static REA pass selected `index.html` and `xpui-routes-collection-local-files.js` from the same extracted-tree digest. Parent Evidence: `ev_8b1a8f1d9aa502943969fbad34174575a6ac282c131f540ba8628020f367b5f8`; summary: `ev_71917545565b12367fb8a714c2ffdc68d6df4e3df8e62fc547e28d45c9791e18`. Selection left 246 files outside analysis and 3468 semantic unknowns. This pass confirms bounded static analysis availability, not live Spotify behavior or native protocol compatibility. The previous feature observations remain historical evidence.

The user selected the Axtify name and light crimson accent. Appearance editing and persistence are original implementation choices.
