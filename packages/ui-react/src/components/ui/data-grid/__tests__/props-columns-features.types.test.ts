import { describe, expectTypeOf, it } from 'vitest';

// BOTH types come from the PACKAGE ROOT BARREL (`src/index.ts`, which re-exports
// `./components/ui/data-grid`), never from `../data-grid` or a module file. That is
// the whole #43 guarantee in this file: the import traverses all three re-export
// hops in source, so it fails if any of them stops carrying either name.
import type {
  DataGridColumnsFeaturesConfig,
  DataGridProps,
} from '../../../../index';

// Per-group prop-surface assertions. These replace the single exhaustive
// `keyof DataGridProps` assertion that used to live in
// `data-table/__tests__/table-family-public-types.test.ts`, which every
// prop-adding unit would have had to edit on the same line. One file per group,
// owned by the unit that owns the group.
//
// Owner: U3 (`columnsFeatures`). Filled by the #50 audit unit — the group shipped
// in `84aab170` while this file still said "NOT YET IMPLEMENTED" and still held an
// `it.todo`, so the type surface of a shipped group was unasserted. **`it.todo`
// never fails**, which is why nothing anywhere reported it.
//
// ── WHAT THIS FILE PROVES, AND THE ONE THING IT CANNOT (#43) ────────────────
//
// `DataGridColumnsFeaturesConfig` was re-exported at **zero of the three hops**
// when this file was filled in, so a consumer could pass `columnsFeatures` and had
// no way to name its type, while `DataGridProps['columnsFeatures']` structurally
// required it. The barrel lines landed with this import; the root-barrel import
// above is what keeps them honest.
//
// **#43's literal gate — "import from the PACKAGE SPECIFIER" — is not runnable
// here, and that is a property of the package rather than a shortcut.**
// `@constructor-lab/ui-react` does not resolve to source from inside its own
// package: no self-link in `node_modules`, no `paths` mapping, and `exports` points
// at `./dist/*.d.ts`. Confirmed with `tsc --traceResolution` — the specifier
// resolves to `packages/ui-react/dist/index.d.ts`, GITIGNORED BUILD OUTPUT. So a
// specifier import would assert against the last build and fail outright in a
// checkout that has not made one.
//
// The residue is therefore real and deliberately not papered over: this proves the
// three source hops carry the type, and **only a post-build check can prove what a
// consumer actually receives** (the `exports` map, the emitted `.d.ts`). That is a
// CI step, filed in #85.

interface Person {
  id: string;
  name: string;
}

describe('DataGrid props — columnsFeatures', () => {
  it('accepts the group', () => {
    expectTypeOf<
      DataGridProps<Person, unknown>['columnsFeatures']
    >().toEqualTypeOf<false | DataGridColumnsFeaturesConfig | undefined>();
  });

  // The group declares `aliases: []`, so there is deliberately nothing to assert
  // for deprecated flat props — and the assertion that would police that belongs
  // elsewhere, not here. `data-table/__tests__/table-family-public-types.test.ts`
  // freezes the ENTIRE deprecated-alias key set on purpose ("this list is closed"),
  // and it does fire: adding a member to `DataGridDeprecatedAliasMap` fails that
  // file's `toEqualTypeOf`, measured during the #50 sweep. A per-group version here
  // would be redundant with a better-placed guard.
  //
  // The first draft of this file did assert `not.toHaveProperty('columnsFeaturesEnabled')`.
  // That is removed rather than kept, for the reason rule 7b gives: the name was
  // invented, so it asserted that a prop nobody ever proposed is absent — coverage
  // in appearance only. Its negative control also exposed the mechanism as unfit:
  // when the key DOES exist the call needs a second argument, so the failure arrives
  // as `TS2554: Expected 2 arguments, but got 1` rather than as a type mismatch.

  // Not in `DataGridIdentityFreeMap`: nothing about column visibility, pinning,
  // resizing or keyboard reordering is keyed by row identity, so the whole group
  // stays available on the identity-free branch (no `getRowId`).
  it('stays available without getRowId', () => {
    expectTypeOf<{
      columns: [];
      rows: Person[];
      columnsFeatures: DataGridColumnsFeaturesConfig;
    }>().toMatchTypeOf<DataGridProps<Person, unknown>>();
  });
});
