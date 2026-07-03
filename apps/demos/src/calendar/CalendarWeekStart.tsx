import * as React from 'react';
import { Calendar } from '@spec-lab/ui-react';

export function CalendarWeekStart() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex justify-center rounded-lg border p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        weekStartsOn={0}
      />
    </div>
  );
}
