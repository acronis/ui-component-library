// AUTO-GENERATED from @constructor-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @constructor-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FittedActions } from '../fitted-actions';

const meta = {
  title: 'Components/FittedActions/All States (generated)',
  component: FittedActions,
} satisfies Meta<typeof FittedActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <FittedActions
        actions={[
          { id: 'edit', label: 'Edit' },
          { id: 'tag', label: 'Tag' },
          { id: 'export', label: 'Export' },
        ]}
      />
    </div>
  ),
};
