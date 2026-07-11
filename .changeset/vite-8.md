---
---

Upgrade the build toolchain to Vite 8 (`vite` 6.4.2 → 8.1.4) and
`@vitejs/plugin-react` 5.1.1 → 6.0.3. Both are dev/build-time dependencies of the
published packages, not shipped runtime deps, and the built output is equivalent
— so this is an intentionally empty changeset (no release).
