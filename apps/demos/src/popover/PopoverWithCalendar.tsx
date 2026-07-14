import * as React from 'react';
import { Button } from '@constructor-lab/ui-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@constructor-lab/ui-react';
import { Calendar } from '@constructor-lab/ui-react';

export function PopoverWithCalendar() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="flex justify-center rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          {date ? date.toLocaleDateString() : 'Pick a date'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
