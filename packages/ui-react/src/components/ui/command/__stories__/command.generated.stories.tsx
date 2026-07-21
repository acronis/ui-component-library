// AUTO-GENERATED from @constructor-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @constructor-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Command } from '../command';

const meta = {
  title: 'Components/Command/All States (generated)',
  component: Command,
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Command
        className="w-80 rounded-md border border-border"
        placeholder="Type a command…"
        commands={[
          {
            heading: 'Suggestions',
            items: [
              { value: 'calendar', label: 'Calendar' },
              { value: 'search', label: 'Search', shortcut: '⌘S' },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <Command
      className="w-80 rounded-md border border-border"
      placeholder="Type a command…"
      commands={[
        {
          heading: 'Suggestions',
          items: [
            { value: 'calendar', label: 'Calendar' },
            { value: 'search', label: 'Search', shortcut: '⌘S' },
          ],
        },
      ]}
    />
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
