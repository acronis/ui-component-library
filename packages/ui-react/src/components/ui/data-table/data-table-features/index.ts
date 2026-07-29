import { columnsFeature } from './columns';
import { detailExpansionFeature } from './detail-expansion';
import { filteringFeature } from './filtering';
import { footerFeature } from './footer';
import { groupingFeature } from './grouping';
import { paginationFeature } from './pagination';
import { persistenceFeature } from './persistence';
import { FEATURE_ORDER, type DataTableFeatureModule } from './registry';
import { selectionFeature } from './selection';
import { sortingFeature } from './sorting';
import { treeFeature } from './tree';
import { virtualizationFeature } from './virtualization';

// ┌──────────────────────────────────────────────────────────────────────────┐
// │  MANIFEST FILE — APPEND-ONLY SHARED.                                     │
// │                                                                          │
// │  This is the single ordered registry list. Add your feature yourself:    │
// │  create `data-table-features/<feature>.ts`, then append its import and   │
// │  its array entry here in the same change. There is no staging block and  │
// │  no integrator hand-off.                                                 │
// │                                                                          │
// │  **The position is yours to choose, and it is a real decision.** Order   │
// │  decides display-row sequence within a record row, the order `effects`   │
// │  hooks run, and adornment ties within one placement — and only the unit  │
// │  adding a feature knows what its stage must sit behind. Keep             │
// │  `FEATURE_ORDER` in step; a test pins the two together.                  │
// │                                                                          │
// │  Append, never reformat, and check nobody else is mid-edit first.        │
// └──────────────────────────────────────────────────────────────────────────┘

/**
 * The feature registry, in design §3.5's committed pipeline order.
 *
 * **The order is load-bearing**, which is why `FEATURE_ORDER` declares it
 * separately and `__tests__/data-table-features.test.tsx` asserts this array
 * matches it. Order decides display-row sequence within a record row, the order
 * `effects` hooks run, and adornment ties within one placement. It does *not*
 * decide who wins a contested key — a collision throws instead.
 */
export const DATA_TABLE_FEATURES: readonly DataTableFeatureModule[] = [
  columnsFeature,
  treeFeature,
  filteringFeature,
  groupingFeature,
  sortingFeature,
  selectionFeature,
  paginationFeature,
  detailExpansionFeature,
  footerFeature,
  virtualizationFeature,
  persistenceFeature,
];

export { FEATURE_ORDER };
