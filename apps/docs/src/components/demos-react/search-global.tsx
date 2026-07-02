'use client';

import { SearchGlobal } from '@spec-lab/ui-react';

export function SearchGlobalDemo() {
  return (
    <div style={{ width: 320 }}>
      <SearchGlobal placeholder="Search anything" shortcut="⌘K" />
    </div>
  );
}
