---
'@constructor-lab/ui-react': minor
---

feat(data-grid): chrome ownership + config validation (P0.7, partial)

- New `chrome` prop implements canonical chrome ownership (design §5.1). It
  defaults to built-in (DataGrid renders its toolbar, filters, bulk bar, and
  pagination). `chrome.mode="external"` keeps the engine state but suppresses
  every built-in control and calls `render(context)` with the shared controller
  plus the current selection, query, and state — so a screen composes its own
  toolbar/pagination without a second engine. The empty/error rows and footer
  stay inside the table. `DataGridChrome` and `DataGridChromeContext` are
  exported.
- Development-time validation of invalid combinations: `chrome.mode="external"`
  with `toolbar`/`searchKey`, and bulk actions without multiple selection, each
  emit a descriptive `console.error`.
- The DataGrid public type continues to expose neither `engineOptions` nor
  `plugins` (advanced engine extension stays on custom DataTable composition),
  now covered by the table-family public-type characterization test.

Story added: `ExternalChrome`.

Remaining P0.7 (its own pass): the full 16-group grouped-config normalization
with precedence/presets, deprecated-alias→grouped duplicate errors, and the
`table-view` / `data-table` screen migrations.
