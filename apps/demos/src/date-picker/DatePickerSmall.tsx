import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import { Calendar } from '@spec-lab/ui-react';
import { Popover, PopoverContent, PopoverTrigger } from '@spec-lab/ui-react';

import { CalendarIcon } from '@spec-lab/icons-react/stroke-mono';
export function DatePickerSmall() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="secondary"
            className={cn(
              'h-8 w-[240px] justify-start text-left text-sm font-normal',
              !date && 'text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-3 w-3" />
        {date ? format(date, 'PP') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
