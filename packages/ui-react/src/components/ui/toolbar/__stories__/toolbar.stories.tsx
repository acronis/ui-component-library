import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonMenu } from '../../button-menu';
import {
  Toolbar,
  ToolbarActions,
  ToolbarButton,
  ToolbarGroup,
  ToolbarStatus,
  type ToolbarActionItem,
} from '../toolbar';

// Toolbar (Figma node 3897-7199; variants matrix 6262-27986): a selection/list
// action bar. The six stories below mirror the Figma "Variants" frame exactly —
// the `state` (active | disabled), a "More actions" ButtonMenu, and a trailing
// counter each toggle independently.
const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    disabled: {
      control: 'boolean',
      description:
        'Disables every action in the toolbar (the Figma `disabled` state). Items stay focusable (`aria-disabled`) for discoverability.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout axis; also flips the arrow-key navigation direction.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
        category: 'Appearance',
      },
    },
    loopFocus: {
      control: 'boolean',
      description:
        'Wrap keyboard focus to the other end when navigating past the first/last item.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the toolbar landmark.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    children: {
      control: false,
      description:
        'Composed parts — ToolbarGroup / Button / Link / Separator / Status.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    render: {
      control: false,
      description: 'Replace the rendered root element (Base UI composition).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: { disabled: false, orientation: 'horizontal', loopFocus: true },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Renders the Figma variant matrix from three flags: whether the toolbar is
// disabled, whether the "More actions" menu is shown, and whether the trailing
// counter is shown. Active → "N items selected:" + Deselect; disabled → an
// item-count status.
function ToolbarVariant({
  moreActions = false,
  counter = true,
}: {
  moreActions?: boolean;
  counter?: boolean;
}) {
  return (
    <Toolbar aria-label="Selection actions">
      <ToolbarGroup>
        <ToolbarButton>First action</ToolbarButton>
        <ToolbarButton>Second action</ToolbarButton>
        <ToolbarButton>Third action</ToolbarButton>
        <ToolbarButton>Fourth action</ToolbarButton>
        <ToolbarButton>Fifth action</ToolbarButton>
        {moreActions && <ButtonMenu variant="secondary">More actions</ButtonMenu>}
      </ToolbarGroup>
      {counter && (
        <ToolbarGroup className="ms-auto">
          <ToolbarStatus>6 items selected:</ToolbarStatus>
          <ToolbarButton>Deselect</ToolbarButton>
        </ToolbarGroup>
      )}
    </Toolbar>
  );
}

function DisabledToolbarVariant({
  moreActions = false,
  counter = true,
}: {
  moreActions?: boolean;
  counter?: boolean;
}) {
  return (
    <Toolbar aria-label="Selection actions" disabled>
      <ToolbarGroup>
        <ToolbarButton>First action</ToolbarButton>
        <ToolbarButton>Second action</ToolbarButton>
        <ToolbarButton>Third action</ToolbarButton>
        <ToolbarButton>Fourth action</ToolbarButton>
        <ToolbarButton>Fifth action</ToolbarButton>
        {moreActions && (
          <ButtonMenu variant="secondary" disabled>
            More actions
          </ButtonMenu>
        )}
      </ToolbarGroup>
      {counter && (
        <ToolbarStatus className="ms-auto">25 of 1250 items loaded</ToolbarStatus>
      )}
    </Toolbar>
  );
}

// ---- the six Figma variants ----

export const Default: Story = {
  name: 'Default Toolbar',
  render: () => <ToolbarVariant />,
};

export const WithMoreActions: Story = {
  name: 'Toolbar + More actions',
  render: () => <ToolbarVariant moreActions />,
};

export const MoreActionsNoCounter: Story = {
  name: 'Toolbar + More actions + no Counter',
  render: () => <ToolbarVariant moreActions counter={false} />,
};

export const Disabled: Story = {
  name: 'Disabled Toolbar',
  render: () => <DisabledToolbarVariant />,
};

export const DisabledWithMoreActions: Story = {
  name: 'Disabled Toolbar + More actions',
  render: () => <DisabledToolbarVariant moreActions />,
};

export const DisabledNoCounter: Story = {
  name: 'Disabled Toolbar + no Counter',
  render: () => <DisabledToolbarVariant counter={false} />,
};

// ---- responsive overflow (Figma breakpoints node 6262-28276) ----

const overflowActions: ToolbarActionItem[] = [
  { id: 'first', label: 'First action' },
  { id: 'second', label: 'Second action' },
  { id: 'third', label: 'Third action' },
  { id: 'fourth', label: 'Fourth action' },
  { id: 'fifth', label: 'Fifth action' },
];

function ResponsiveRow({ width }: { width: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{width}px</span>
      <div style={{ width }} className="rounded-md border border-border p-2">
        <Toolbar aria-label={`Selection actions (${width}px)`}>
          <ToolbarActions actions={overflowActions} />
          <ToolbarGroup className="ms-auto shrink-0">
            <ToolbarStatus>6 selected:</ToolbarStatus>
            <ToolbarButton>Deselect</ToolbarButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
    </div>
  );
}

// `ToolbarActions` measures its available width and moves the trailing actions
// into a "More actions" menu when they don't fit — the Figma breakpoints rule
// ("last actions must be hidden under More actions"). Each fixed-width row below
// shows a different stage of that collapse.
export const ResponsiveOverflow: Story = {
  name: 'Responsive overflow',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <ResponsiveRow width={900} />
      <ResponsiveRow width={640} />
      <ResponsiveRow width={460} />
    </div>
  ),
};
