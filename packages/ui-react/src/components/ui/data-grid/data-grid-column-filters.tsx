import { useState } from 'react';

import type { Column } from '@tanstack/react-table';

import type { DataTableController } from '../data-table';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Chip } from '../chip';
import { Filter } from '../filter';
import { InputText } from '../input-text';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import type { DataGridFacetSource } from './data-grid-config';
import {
  FILTER_OPERATOR_LABELS,
  isMeaningfulFilter,
  isValuelessOperator,
  type DataGridFilterOperator,
  type DataGridFilterValue,
} from './data-grid-filter-operators';

// Private DataGrid chrome (design §4.3, "Column filter controls" — owned by
// DataGrid, composed from Filter/Popover/Select/Input/Chip primitives). It reads
// and mutates the ONE shared DataTable controller: each control drives a column
// filter through the engine, and the applied-filter chips reflect the engine's
// committed `columnFilters` state.
//
// **Two exported halves, in two different rows** (PLTFRM-93130): the triggers go in
// the toolbar row so a bulk selection replaces them, the chips stay under it so the
// active filter set remains readable while acting on that selection. They were one
// component in one row until then. Both take the same props and read the same
// controller; only the placement differs.

export interface ResolvedColumnFilterDef {
  readonly columnId: string;
  readonly label: string;
  readonly operators: readonly DataGridFilterOperator[];
  /** Option source for a set-membership control; absent means free text. */
  readonly facet?: DataGridFacetSource;
}

/**
 * The options a faceted control offers, resolved against the engine.
 *
 * `'unique'` and `'min-max'` read the **pre-filter** row model, which is why the
 * option list keeps showing every choice — and its counts — while a filter is
 * applied. Both require the faceted row models, which the `filters` feature
 * installs only when some definition asks for a facet.
 */
function facetOptions<TData>(
  column: Column<TData, unknown> | undefined,
  facet: DataGridFacetSource
): readonly { value: string; count?: number }[] {
  if (Array.isArray(facet)) {
    return facet.map((value) => ({ value: String(value) }));
  }
  if (column === undefined) {
    return [];
  }
  if (facet === 'min-max') {
    const range = column.getFacetedMinMaxValues();
    return range === undefined
      ? []
      : [{ value: String(range[0]) }, { value: String(range[1]) }];
  }
  return [...column.getFacetedUniqueValues().entries()]
    .filter(([value]) => value !== null && value !== undefined && value !== '')
    .sort((left, right) => String(left[0]).localeCompare(String(right[0])))
    .map(([value, count]) => ({ value: String(value), count }));
}

interface DataGridColumnFiltersProps<TData> {
  readonly controller: DataTableController<TData>;
  readonly filters: readonly ResolvedColumnFilterDef[];
}

function summarizeFilter(label: string, filter: DataGridFilterValue): string {
  const operator = FILTER_OPERATOR_LABELS[filter.operator];
  return isValuelessOperator(filter.operator)
    ? `${label} ${operator}`
    : `${label} ${operator} "${filter.value ?? ''}"`;
}

function ColumnFilterControl<TData>({
  controller,
  def,
}: {
  controller: DataTableController<TData>;
  def: ResolvedColumnFilterDef;
}) {
  const column = controller.table.getColumn(def.columnId);
  const current = column?.getFilterValue() as DataGridFilterValue | undefined;
  const isActive = current !== undefined;

  const [open, setOpen] = useState(false);
  const [operator, setOperator] = useState<DataGridFilterOperator>(
    current?.operator ?? def.operators[0]
  );
  const [value, setValue] = useState(current?.value ?? '');

  // Seed the draft from the committed filter each time the popover opens, so an
  // abandoned edit does not leak into the next open.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setOperator(current?.operator ?? def.operators[0]);
      setValue(current?.value ?? '');
    }
    setOpen(next);
  };

  const apply = () => {
    const next: DataGridFilterValue = { operator, value };
    column?.setFilterValue(isMeaningfulFilter(next) ? next : undefined);
    setOpen(false);
  };

  const clear = () => {
    column?.setFilterValue(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Filter
            variant="outline"
            active={isActive}
            count={isActive ? 1 : 0}
          />
        }
      >
        {def.label}
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-64 flex-col gap-3 p-3">
        {def.operators.length > 1 && (
          <Select
            value={operator}
            onValueChange={(next) =>
              setOperator(next as DataGridFilterOperator)
            }
          >
            <SelectTrigger aria-label={`${def.label} operator`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {def.operators.map((option) => (
                <SelectItem key={option} value={option}>
                  {FILTER_OPERATOR_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!isValuelessOperator(operator) &&
          (def.facet === undefined ? (
            <InputText
              aria-label={`${def.label} value`}
              placeholder="Value…"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  apply();
                }
              }}
            />
          ) : (
            <div
              role="group"
              aria-label={`${def.label} options`}
              className="flex max-h-56 flex-col gap-1 overflow-y-auto"
            >
              {facetOptions(column, def.facet).map((option) => (
                // Not a `<label>` wrapper: the Base UI checkbox renders a span
                // rather than an input, so implicit label association does not
                // apply and adding one only produces a second accessible name for
                // the same control. `aria-label` on the control is the single
                // source, matching how the selection checkboxes are named.
                <div
                  key={option.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <Checkbox
                    aria-label={option.value}
                    checked={value === option.value}
                    onCheckedChange={(checked) =>
                      setValue(checked ? option.value : '')
                    }
                  />
                  <span aria-hidden className="flex-1 truncate">
                    {option.value}
                  </span>
                  {option.count !== undefined && (
                    <span className="text-[var(--ui-text-on-surface-secondary)]">
                      {option.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={clear} className="h-8">
            Clear
          </Button>
          <Button onClick={apply} className="h-8">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * The filter **triggers** — one popover control per definition. Rendered inside the
 * toolbar row (PLTFRM-93130), next to search and whatever `toolbar.trailing`
 * carries, so a selection's bulk actions replace them the way Figma specifies. They
 * used to sit in the `under-toolbar` slot together with the chips below, where a
 * bulk selection could not cover them.
 */
export function DataGridColumnFilterTriggers<TData>({
  controller,
  filters,
}: DataGridColumnFiltersProps<TData>) {
  return (
    // `shrink-0`, not `min-w-0`: the triggers do not shrink individually, so a
    // shrinkable wrapper just overflows its own box and paints over whatever sits
    // next to it in the row — measured as the search input landing on top of a
    // trigger. Holding their width makes the search box (which *can* shrink) give
    // way instead.
    <div className="flex shrink-0 items-center gap-2">
      {filters.map((def) => (
        <ColumnFilterControl
          key={def.columnId}
          controller={controller}
          def={def}
        />
      ))}
    </div>
  );
}

/**
 * The **applied-filter chips**, plus `Clear all`. Stays in the `under-toolbar` slot
 * and is deliberately *not* replaced while rows are selected: the chips say which
 * result set the selection was drawn from, which is exactly what a person needs
 * while deciding whether to act on it.
 *
 * ⚠ Renders nothing when no filter is applied, so the first chip still adds a row
 * and shifts the table down. That is a **second, separate** jump source from the one
 * PLTFRM-93130 fixed — it fires on a deliberate filter action rather than on an
 * incidental row click — and it is knowingly left alone here rather than reserving
 * an always-empty strip under every filterable grid. See ui-blocks ADR-0003.
 */
export function DataGridColumnFilterChips<TData>({
  controller,
  filters,
}: DataGridColumnFiltersProps<TData>) {
  const activeFilters = controller.getState().columnFilters;
  const labelById = new Map(filters.map((def) => [def.columnId, def.label]));

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => {
        const label = labelById.get(filter.id) ?? filter.id;
        const summary = summarizeFilter(
          label,
          filter.value as unknown as DataGridFilterValue
        );
        return (
          <Chip
            key={filter.id}
            variant="removable"
            removeLabel={`Remove ${label} filter`}
            onRemove={() =>
              controller.table.getColumn(filter.id)?.setFilterValue(undefined)
            }
          >
            {summary}
          </Chip>
        );
      })}

      {/* Unconditional now: the early return above already established that at
          least one filter is applied. */}
      <Button
        variant="ghost"
        className="h-8"
        onClick={() => controller.table.resetColumnFilters()}
      >
        Clear all
      </Button>
    </div>
  );
}
