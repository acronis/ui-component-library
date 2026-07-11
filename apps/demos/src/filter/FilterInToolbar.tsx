import { Filter } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';

export function FilterInToolbar() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex gap-2">
        <Filter count={3}>Filters</Filter>
        <Button variant="secondary">Sort</Button>
        <Button variant="secondary">Export</Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing 24 of 156 items
      </div>
    </div>
  );
}
