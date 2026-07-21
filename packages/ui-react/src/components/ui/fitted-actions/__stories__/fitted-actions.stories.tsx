import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowExportIcon,
  BinIcon,
  PencilIcon,
  TagIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { FittedActions, type FittedAction } from '../fitted-actions';

const actions: FittedAction[] = [
  { id: 'edit', label: 'Edit', icon: <PencilIcon size={16} /> },
  { id: 'tag', label: 'Tag', icon: <TagIcon size={16} /> },
  { id: 'export', label: 'Export', icon: <ArrowExportIcon size={16} /> },
  { id: 'delete', label: 'Delete', icon: <BinIcon size={16} />, divided: true },
];

// FittedActions — a responsive action row (React port of the ui-kit Vue
// AvFittedActions). Actions render inline until they run out of room, then the
// trailing ones collapse into a "More" dropdown; it recomputes on resize.
const meta = {
  title: 'Components/FittedActions',
  component: FittedActions,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    actions: {
      control: false,
      description: 'Ordered actions; trailing items overflow into the menu first.',
      table: { type: { summary: 'FittedAction[]' }, category: 'Content' },
    },
    showDropdown: {
      control: 'boolean',
      description:
        'Collapse overflow into a "More" menu. When false, all actions render inline.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    moreLabel: {
      control: 'text',
      description: 'Label for the overflow trigger.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: "'More'" },
        category: 'Content',
      },
    },
    gap: {
      control: 'number',
      description: 'Inter-item gap in px (also reserved when measuring).',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
        category: 'Appearance',
      },
    },
    onAction: {
      control: false,
      description: 'Fired for any chosen action, after its own onSelect.',
      table: { type: { summary: '(action) => void' }, category: 'Events' },
    },
    renderAction: {
      control: false,
      description: 'Customize the inline action element (default: a ghost Button).',
      table: { type: { summary: '(action, api) => ReactNode' }, category: 'Composition' },
    },
    renderTrigger: {
      control: false,
      description: 'Customize the overflow trigger (default: a ghost Button).',
      table: { type: { summary: '(api) => ReactElement' }, category: 'Composition' },
    },
  },
  args: { actions, showDropdown: true, moreLabel: 'More', gap: 8 },
} satisfies Meta<typeof FittedActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <FittedActions {...args} />,
};

// Each fixed-width row shows a different stage of the overflow collapse.
export const ResponsiveOverflow: Story = {
  name: 'Responsive overflow',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6">
      {[520, 360, 220].map((width) => (
        <div key={width} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{width}px</span>
          <div
            style={{ width }}
            className="rounded-md border border-border p-2"
          >
            <FittedActions {...args} />
          </div>
        </div>
      ))}
    </div>
  ),
};

// With `showDropdown={false}` every action stays inline (no overflow menu).
export const WithoutDropdown: Story = {
  args: { showDropdown: false },
  render: (args) => (
    <div style={{ width: 220 }} className="rounded-md border border-border p-2">
      <FittedActions {...args} />
    </div>
  ),
};
