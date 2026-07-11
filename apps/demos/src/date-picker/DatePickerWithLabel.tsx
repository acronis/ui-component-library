import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import { Calendar } from '@spec-lab/ui-react';
import { Popover, PopoverContent, PopoverTrigger } from '@spec-lab/ui-react';

import { CalendarIcon } from '@spec-lab/icons-react/stroke-mono';
export function DatePickerWithLabel() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="space-y-2">
      <label htmlFor="birth-date" className="text-sm font-medium">
        Date of Birth
      </label>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id="birth-date"
              variant="secondary"
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Select your birth date</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={new Date(1990, 0)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
