---
'@constructor-lab/ui-react': minor
---

DataTable: add the `persistence` restore/save engine (U10, DataTable half).

Persisted table preferences behind a versioned storage envelope (design §8). The
mechanism lives in DataTable so a direct `useDataTable` caller gets it without
DataGrid; the `persistence` config prop on DataGrid follows separately.

- **New `data-table-persistence.ts`** — the engine. `planDataTableRestore` turns a
  stored payload into a list of slice writes (validate → migrate → prune), and
  `useDataTablePersistence` runs it from the `persistence` feature module's
  `effects` hook, then saves whenever a managed slice changes.
- **Restore lands after the column model normalizes and before interaction**
  (§6.13) by virtue of being a mount effect, and emits `requestChange(…,
'restore')` — the first emitter of a `DataTableChangeCause` that has existed
  since F1 with nothing producing it.
- **Validation and pruning are distinct.** An unknown column id is schema
  evolution: the entry is pruned and the rest of the slice restores. A wrong type
  is corruption: the whole slice is discarded. Pruning is against
  `getAllLeafColumns`, so a hidden column's stored width still restores.
- **No live row state by default, enforced at compile time.** Selection,
  detail/tree expansion and the current row are not merely absent from the default
  `include` set — they cannot be named in it, and adding one fails to compile
  (`_AssertNoRowStatePersisted`). `pagination` is nameable but not default.
- **Two new `DataTableFeatureGates` members**, `controlledSlices` and
  `defaultedSlices`, derived from the own-keys of the controller's `state` and
  `defaultState` props. A resolved state snapshot cannot express "the caller did
  not ask for this", so neither exclusion is derivable from it.
  - A **controlled** slice is excluded from restore **and** save: the controller
    declines to commit one but still emits its change event, and a controlled
    caller applying that event is the overwrite `behavior.md:462-468` forbids.
  - A **`defaultState`** slice is excluded from **restore only**. It is just the
    caller's initial value, so later user changes to it are still saved —
    collapsing the two sets would silently disable persistence for any slice the
    caller gave a default.
- **Write discipline:** nothing is written before the restore attempt settles (a
  mount write would delete the payload before reading it), and a restore itself
  writes nothing. Storage is touched only inside effects, so server rendering
  never reaches an adapter.

No public API change in this changeset — `DataTablePersistenceConfig` is reachable
through `DataTableControllerOptions` and the DataGrid prop lands with the config
group.
