// AUTO-GENERATED from @constructor-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @constructor-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolbarGroup, ToolbarButton, ToolbarStatus } from '../toolbar';
import { Toolbar } from '../toolbar';

const meta = {
  title: 'Components/Toolbar/All States (generated)',
  component: Toolbar,
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Toolbar aria-label="Selection actions">
        <ToolbarGroup>
          <ToolbarButton>First action</ToolbarButton>
          <ToolbarButton>Second action</ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup className="ms-auto">
          <ToolbarStatus>6 items selected:</ToolbarStatus>
          <ToolbarButton>Deselect</ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
      <Toolbar aria-label="Selection actions" disabled>
        <ToolbarGroup>
          <ToolbarButton>First action</ToolbarButton>
          <ToolbarButton>Second action</ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup className="ms-auto">
          <ToolbarStatus>6 items selected:</ToolbarStatus>
          <ToolbarButton>Deselect</ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </div>
  ),
};
