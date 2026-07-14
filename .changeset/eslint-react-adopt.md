---
---

Adopt the full `@eslint-react` recommended-typescript rule set (dropping the
earlier deferrals) and fix all findings across ui-react + the apps. Changes are
behavior-preserving lint refactors — React-19 `<Context>`/`use()` forms, derived
state / event handlers instead of `set-state-in-effect`, hoisted nested
components, stable list keys, lazy `useState` initializers — with scoped,
justified `eslint-disable`s only for genuine external-store syncs, DOM-measuring
layout effects, and static demo data. No public API or runtime behavior change,
so this is an intentionally empty changeset (no release).
