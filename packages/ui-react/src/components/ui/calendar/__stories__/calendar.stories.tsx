import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { arSA, de } from 'react-day-picker/locale';

import { Calendar } from '../calendar';
import { InputDatePicker } from '../../input-date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';

// Dates are PINNED (fixed month / today / selection) so the visual-regression
// baselines are deterministic — a live "today" marker would drift the snapshot
// every day.
const MONTH = new Date(2024, 0, 1); // January 2024
const TODAY = new Date(2024, 0, 10);

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { mode: 'single', captionLayout: 'label', showOutsideDays: true },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode (from react-day-picker): one date, many dates, or a range.',
      table: { type: { summary: "'single' | 'multiple' | 'range'" }, category: 'Behavior' },
    },
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
      description: 'Month/year caption: a static label or month/year dropdowns.',
      table: {
        type: { summary: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'" },
        defaultValue: { summary: 'label' },
        category: 'Appearance',
      },
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Render the trailing/leading days of adjacent months.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Appearance' },
    },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3 },
      description: 'How many months to display side by side.',
      table: { type: { summary: 'number' }, category: 'Appearance' },
    },
    selected: { control: false, table: { category: 'Behavior' } },
    onSelect: { control: false, table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: 'single',
    defaultMonth: MONTH,
    today: TODAY,
    selected: new Date(2024, 0, 15),
    onSelect: () => {},
  },
};

export const Range: Story = {
  args: {
    mode: 'range',
    defaultMonth: MONTH,
    today: TODAY,
    selected: { from: new Date(2024, 0, 8), to: new Date(2024, 0, 12) },
    onSelect: () => {},
  },
};

export const DropdownCaption: Story = {
  args: {
    mode: 'single',
    captionLayout: 'dropdown',
    defaultMonth: MONTH,
    today: TODAY,
    selected: new Date(2024, 0, 15),
    onSelect: () => {},
  },
};

export const WithDisabledDays: Story = {
  args: {
    mode: 'single',
    defaultMonth: MONTH,
    today: TODAY,
    // Disable weekends for the demo.
    disabled: { dayOfWeek: [0, 6] },
    onSelect: () => {},
  },
};

// `InputDatePicker` is the field trigger only; it owns no popup. The canonical
// composition wires it as a `Popover` trigger with this `Calendar` as the
// panel. Rendered open (pinned selection/month) so the VR baseline captures the
// trigger + calendar together.
function DatePickerField() {
  const [open, setOpen] = React.useState(true);
  const [date, setDate] = React.useState<Date | undefined>(new Date(2024, 0, 15));
  return (
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
            className="w-56"
          />
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          defaultMonth={MONTH}
          today={TODAY}
          selected={date}
          onSelect={(d) => {
            setDate(d);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export const InInputDatePicker: Story = {
  render: () => <DatePickerField />,
  parameters: { snapshot: { animationDelay: 400 } },
};

// Localization is driven entirely by react-day-picker: pass a date-fns `locale`
// (re-exported from `react-day-picker/locale`, no extra dependency) for
// translated month/weekday names and the locale's first day of the week, and
// `dir="rtl"` to mirror the layout for right-to-left languages. Shown here:
// German (`de`, Monday-first) and Arabic (`arSA`, RTL).
export const Localized: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Calendar
        mode="single"
        locale={de}
        defaultMonth={MONTH}
        today={TODAY}
        selected={new Date(2024, 0, 15)}
        onSelect={() => {}}
      />
      <Calendar
        mode="single"
        locale={arSA}
        dir="rtl"
        defaultMonth={MONTH}
        today={TODAY}
        selected={new Date(2024, 0, 15)}
        onSelect={() => {}}
      />
    </div>
  ),
};
