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
export function DatePickerForm() {
  const [appointmentDate, setAppointmentDate] = React.useState<Date>();

  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <div className="space-y-2">
        <label htmlFor="appointment-date" className="text-sm font-medium">
          Appointment Date <span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="appointment-date"
                variant="secondary"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !appointmentDate && 'text-muted-foreground'
                )}
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {appointmentDate ? (
              format(appointmentDate, 'PPP')
            ) : (
              <span>Select appointment date</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={appointmentDate}
              onSelect={setAppointmentDate}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-500">
          Please select a future date for your appointment.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="event-date" className="text-sm font-medium">
          Event Date
        </label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="event-date"
                variant="secondary"
                className="w-full justify-start text-left font-normal text-muted-foreground"
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Optional event date</span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
