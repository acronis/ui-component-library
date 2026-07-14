import * as React from 'react';
import { Calendar } from '@spec-lab/ui-react';

export function CalendarMinMax() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date());
  const disabled = React.useMemo(() => {
    const today = new Date();
    const inThreeMonths = new Date(new Date().setMonth(today.getMonth() + 3));
    return [{ before: today }, { after: inThreeMonths }];
  }, []);

  return (
    <div>
      <div className="flex justify-center rounded-lg border p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabled}
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Only dates within the next 3 months can be selected.
      </p>
    </div>
  );
}
