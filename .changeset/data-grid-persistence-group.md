---
'@constructor-lab/ui-react': minor
---

DataGrid: add the `persistence` behavior group (U10, DataGrid half).

`<DataGrid persistence={{ key, version, storage }} />` restores stored column
preferences on mount and saves them as they change. `key`, `version` and `storage`
are required (design §8); `include`, `migrate` and `onError` are optional.

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  persistence={{
    key: 'servers-grid',
    version: 2,
    storage: {
      read: (key) => localStorage.getItem(key),
      write: (key, value) => localStorage.setItem(key, value),
    },
  }}
/>
```

- **Defaults to the four column slices** — visibility, order, sizing and pinning.
  Sorting, filters, grouping and the page index are opt-in through `include`;
  selection, detail/tree expansion and the current row cannot be named at all
  (design §5.2).
- **No `getRowId` required.** Every persistable slice is keyed by column id, so
  the group is deliberately absent from the identity rule — a caller may persist
  column preferences without supplying row identity.
- **The group renders no chrome.** A restore is visible only as the ordinary
  chrome of whatever slice it restored into, so it contributes a config prop and
  nothing else; all mechanics are the DataTable engine's.
- **It warns rather than half-configuring.** A JS caller missing `key`, `version`
  or `storage` disables the group with a message naming the missing members, and
  an `include` entry the library does not recognise is reported — the engine drops
  an unknown slice name silently, so the warning is the only signal a caller gets.
- **Precedence is `state` > `defaultState` > stored payload > config defaults.** A
  slice the caller controls is neither restored into nor saved; a slice the caller
  gave a `defaultState` is not restored into but _is_ still saved once the user
  changes it.

New public type: `DataGridPersistenceConfig`. Its barrel re-export is batched with
the other public-type lines at branch close, so reach it from
`@constructor-lab/ui-react` only after that lands.
