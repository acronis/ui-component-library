import type { Meta, StoryObj } from '@storybook/react-vite';

import { TruncatedText } from '../truncated-text';

const LONG =
  'Acme Corporation International Holdings & Subsidiaries — Global Compliance Division';

const meta = {
  title: 'Components/TruncatedText',
  component: TruncatedText,
  // Constrain width so truncation is observable; the tooltip only appears (on
  // hover / focus) when the text is actually clipped.
  decorators: [
    (Story) => (
      <div
        style={{
          width: 220,
          border: '1px dashed var(--ui-border-on-surface-border)',
          padding: 8,
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    children: {
      control: 'text',
      description:
        'The text to display. Also used verbatim as the tooltip body when the text is truncated.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    lines: {
      control: { type: 'number', min: 1 },
      description:
        'Max lines before truncating. `1` (default) = single-line ellipsis; `>1` = a multi-line clamp.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'Behavior',
      },
    },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description:
        'Which side the tooltip opens on when the text is truncated.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: "'top'" },
        category: 'Behavior',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        'Force the tooltip open on mount (only has effect when the text is truncated). Mainly for stories / visual review.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
    className: {
      control: 'text',
      description: 'Extra classes merged onto the text span.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    portalContainer: {
      control: false,
      description:
        'Container the tooltip popup portals into (e.g. a shadow root). Defaults to the document body.',
      table: { type: { summary: 'HTMLElement | null' }, category: 'Behavior' },
    },
  },
} satisfies Meta<typeof TruncatedText>;
export default meta;
type Story = StoryObj<typeof meta>;

// Fits within the width → plain text, no tooltip attached.
export const Fits: Story = { args: { children: 'Acme Corp' } };

// Overflows → single-line ellipsis; hover / focus reveals the full value.
export const Truncated: Story = { args: { children: LONG } };

// Multi-line clamp: truncates after N lines, ellipsis on the last line.
export const MultiLineClamp: Story = { args: { children: LONG, lines: 2 } };

// The tooltip shown open — the full value revealed when the text is clipped.
// `defaultOpen` forces it for review; fullPage capture includes the portalled popup.
export const TooltipVisible: Story = {
  args: { children: LONG, side: 'bottom', defaultOpen: true },
  parameters: { snapshot: { fullPage: true } },
};
