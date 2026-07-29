---
'@constructor-lab/icons-react': patch
---

fix(icons): un-transpose `chevron-first` / `chevron-last` artwork

The two icons carried each other's path data, so `ChevronFirstIcon` rendered
`>|` ("go to last") and `ChevronLastIcon` rendered `|<` ("go to first"). Any
pager built on them — including this kit's own `DataTablePagination` and
`DataGridPagination` — showed the go-to-last glyph on its go-to-first button and
vice versa, while behaving correctly.

The fix swaps the `d` attribute between the two masters in
`@constructor-lab/icons-svg`; `stroke-mono/chevron-{first,last}.tsx` are
regenerated from them. Nothing else changes: no name, export, viewBox, stroke
rule, or prop is affected, and both icons keep rendering at every size.

**Pre-existing, not a regression** — the transposition dates to the initial icon
import (`01040922`) and has shipped in every published `icons-react` release
since. Consumers that read the names at face value were always correct and need
no change; a consumer that swapped the two to compensate for the artwork will
need to un-swap them.

Verified by rendering both masters against the known-correct `chevron-left` /
`chevron-right` controls: `chevron-first` is now `|<` and `chevron-last` is `>|`.
The other directional pairs in the set (`chevron-left/right`,
`chevrons-left/right`, `arrow-{left,right}-{to,from}-line`,
`media-skip-{back,forward}`, `media-step-{back,forward}`, `arrow-import/export`,
`arrows-collapse/expand`, `arrow-left/right`, `arrow-up/down`,
`arrow-trend-up/down`) were audited and are correct.
