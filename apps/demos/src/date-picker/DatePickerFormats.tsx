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

import { CalendarIcon } from '@constructor-lab/icons-react/stroke-mono';
export function DatePickerFormats() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="flex flex-wrap gap-4">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="secondary"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'MM/dd/yyyy') : <span>MM/DD/YYYY</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="secondary"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd.MM.yyyy') : <span>DD.MM.YYYY</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="secondary"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy-MM-dd') : <span>YYYY-MM-DD</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
