// AUTO-GENERATED from @constructor-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @constructor-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '../label';

const meta = {
  title: 'UI/Label/All States (generated)',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Label />
    </div>
  ),
};
