'use client';

import * as React from 'react';
import {
  Calendar,
  InputDatePicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@spec-lab/ui-react';
import { arSA, de } from 'react-day-picker/locale';
import { useShadowMount } from '@/components/ShadowDemo';

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2024, 0, 15)
  );
  return (
    <Calendar
      mode="single"
      defaultMonth={new Date(2024, 0, 1)}
      selected={date}
      onSelect={(d) => setDate(d)}
      className="rounded-lg border border-border"
    />
  );
}

// Localization comes from react-day-picker: a date-fns `locale` (re-exported by
// `react-day-picker/locale`) translates the labels and sets the first day of the
// week; `dir="rtl"` mirrors the layout. German (LTR) + Arabic (RTL) shown here.
export function CalendarLocalizedDemo() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2024, 0, 15)
  );
  return (
    <div className="flex flex-wrap gap-6">
      <Calendar
        mode="single"
        locale={de}
        defaultMonth={new Date(2024, 0, 1)}
        selected={date}
        onSelect={(d) => setDate(d)}
        className="rounded-lg border border-border"
      />
      <Calendar
        mode="single"
        locale={arSA}
        dir="rtl"
        defaultMonth={new Date(2024, 0, 1)}
        selected={date}
        onSelect={(d) => setDate(d)}
        className="rounded-lg border border-border"
      />
    </div>
  );
}

// `InputDatePicker` is the trigger only — it owns no popup — so it's composed
// with a `Popover` holding the `Calendar`.
export function CalendarInInputDatePickerDemo() {
  const mount = useShadowMount();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="w-64">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <InputDatePicker
              label="Start date"
              placeholder="Pick a date"
              open={open}
              value={date?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            />
          }
        />
        <PopoverContent
          portalContainer={mount}
          align="start"
          className="w-auto p-0"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
