// AUTO-GENERATED from @constructor-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @constructor-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '../calendar';

const meta = {
  title: 'UI/Calendar/All States (generated)',
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Calendar
        mode="single"
        defaultMonth={new Date(2024, 0, 1)}
        today={new Date(2024, 0, 10)}
        selected={new Date(2024, 0, 15)}
        onSelect={() => {}}
      />
      <Calendar
        mode="single"
        defaultMonth={new Date(2024, 0, 1)}
        today={new Date(2024, 0, 10)}
        selected={new Date(2024, 0, 15)}
        onSelect={() => {}}
        disabled
      />
    </div>
  ),
};
