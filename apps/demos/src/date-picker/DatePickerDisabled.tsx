import { Button } from '@constructor-lab/ui-react';

import { CalendarIcon } from '@constructor-lab/icons-react/stroke-mono';
export function DatePickerDisabled() {
  return (
    <Button
      variant="secondary"
      disabled
      className="w-[280px] justify-start text-left font-normal"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      <span>Pick a date</span>
    </Button>
  );
}
