// AUTO-GENERATED from @constructor-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @constructor-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '../aspect-ratio';

const meta = {
  title: 'UI/AspectRatio/All States (generated)',
  component: AspectRatio,
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <AspectRatio ratio={16 / 9} className="w-64">
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),
};
