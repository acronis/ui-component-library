import * as React from 'react';
import { Checkbox, Label } from '@spec-lab/ui-react';

export function CheckboxIndeterminate() {
  const [state, setState] = React.useState<boolean | 'indeterminate'>(
    'indeterminate'
  );

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="indeterminate"
        checked={state === true}
        indeterminate={state === 'indeterminate'}
        onCheckedChange={setState}
      />
      <Label
        htmlFor="indeterminate"
        className="text-sm font-normal cursor-pointer"
      >
        {state === 'indeterminate'
          ? 'Indeterminate'
          : state
            ? 'Checked'
            : 'Unchecked'}
      </Label>
    </div>
  );
}
