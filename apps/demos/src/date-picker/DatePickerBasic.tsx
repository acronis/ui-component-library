import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '@spec-lab/shadcn-uikit/react';
import { Button } from '@spec-lab/shadcn-uikit/react';
import { Calendar } from '@spec-lab/shadcn-uikit/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@spec-lab/shadcn-uikit/react';

import { CalendarIcon } from '@spec-lab/shadcn-uikit';
export function DatePickerBasic() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, 'PPP') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
