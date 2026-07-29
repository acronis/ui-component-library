---
'@constructor-lab/ui-react': minor
---

feat(data-grid): `selection.selectAll` — page, loaded, and all-results scopes (U8)

**`selection.selectAll`** says what the header select-all covers:

```tsx
selection={{ mode: 'multiple', selectAll: 'loaded' }}
```

- **`page`** — the current page's eligible rows. What already shipped.
- **`loaded`** — every eligible loaded row, across pages.
- **`all-results`** — everything the query matches.

Unset means **page when paginated, loaded otherwise** (design §6.1), so nothing
changes for an existing caller.

**`all-results` is the one that needed new machinery**, because its member set is
exactly what DataGrid has never seen. It requires an application-issued
`server.selection` token scoped to the current `query.requestKey`; DataGrid never
invents one and never labels the loaded window as all server results. With a valid
token:

- each row checkbox is derived from `!excludedIds.has(row.id)` rather than from any
  engine slice — the token can describe rows that were never loaded;
- toggling a row emits an **exclusion delta** through `server.onSelectionChange`
  and commits nothing to the engine, so the controlled token stays authoritative;
- the header control is fully checked only when there are no exclusions, clears
  the exclusions when activated from its mixed state, and requests
  `selection: undefined` — the absence of a selection — when deselecting
  everything. That last encoding is deliberate: an all-results token excluding
  every _loaded_ id would claim exclusions for rows the application may never have
  sent.

This completes `ui-spec/…/data-table/behavior.md`'s "All-results token cannot cross
a query", whose last clause — "toggled exclusions emit against the authoritative
token without mutating it internally" — was the part deferred when `server.selection`
shipped.

**Without a usable token, `all-results` degrades to the default scope and reports
the combination** (design §5.2). It does not disable the control and it does not
fake the claim.

**One asymmetry worth knowing.** The all-results toggle reports
`cause: 'pointer'`, because it emits from the click handler. Every other selection
change reports `'api'`, because it goes through `row.toggleSelected()` and the
controller cannot see what drove it. Both values are honest; the difference is that
the engine round-trip loses the provenance the call site had.

**Also recorded rather than relied on:** the `loaded` half of the default has no
observable consequence today. Without a pagination row model, TanStack's
page-scoped predicates and toggles already cover the whole row model, so `page` and
`loaded` coincide exactly when the grid does not paginate. The distinction is
reachable only through an explicit `selectAll: 'loaded'` on a paginated grid. The
code follows §6.1 anyway, because agreeing with the spec costs nothing.
