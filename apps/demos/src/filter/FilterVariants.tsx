import { Filter } from '@spec-lab/ui-react';

export function FilterVariants() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Filter variant="ghost" count={3}>
        Ghost
      </Filter>
      <Filter variant="outline" count={3}>
        Outline
      </Filter>
      <Filter variant="default" count={3}>
        Default
      </Filter>
    </div>
  );
}
