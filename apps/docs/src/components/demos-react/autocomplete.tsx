'use client';

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@spec-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

const countries = [
  'Australia',
  'Austria',
  'Belgium',
  'Canada',
  'Denmark',
  'France',
  'Germany',
  'Ireland',
];

export function AutocompleteDemo() {
  const mount = useShadowMount();
  return (
    <div style={{ width: 260 }}>
      <Autocomplete items={countries}>
        <AutocompleteInput placeholder="Search country…" clearable />
        <AutocompleteContent portalContainer={mount}>
          <AutocompleteEmpty>No match — keep what you typed.</AutocompleteEmpty>
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
}
