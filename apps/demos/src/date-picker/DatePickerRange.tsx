import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';
import { Calendar } from '@constructor-lab/ui-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@constructor-lab/ui-react';

type DateRange = { from: Date | undefined; to?: Date | undefined };

import { CalendarIcon } from '@constructor-lab/icons-react/stroke-mono';
export function DatePickerRange() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="secondary"
            className={cn(
              'w-[320px] justify-start text-left font-normal',
              !dateRange.from && 'text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dateRange.from ? (
          dateRange.to ? (
            <>
              {format(dateRange.from, 'LLL dd, y')} -{' '}
              {format(dateRange.to, 'LLL dd, y')}
            </>
          ) : (
            format(dateRange.from, 'LLL dd, y')
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range) =>
            setDateRange(range ?? { from: undefined, to: undefined })
          }
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
