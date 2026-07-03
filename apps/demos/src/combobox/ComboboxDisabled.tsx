import { Button } from '@spec-lab/shadcn-uikit/react';

import { ArrowsDownUpIcon } from '@spec-lab/icons-react/stroke-mono'
export function ComboboxDisabled() {
  return (
    <Button
      variant="outline"
      role="combobox"
      disabled
      className="w-[280px] justify-between"
    >
      Select framework...
      <ArrowsDownUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}
