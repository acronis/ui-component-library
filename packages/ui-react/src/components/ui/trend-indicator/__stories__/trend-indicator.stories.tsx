import type { Meta, StoryObj } from '@storybook/react-vite';

import { TrendIndicator } from '../trend-indicator';

const meta = {
  title: 'UI/TrendIndicator',
  component: TrendIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['up', 'down', 'flat'],
      description:
        'What changed mathematically — selects the direction glyph. Independent of `sentiment`.',
      table: {
        type: { summary: "'up' | 'down' | 'flat'" },
        category: 'Content',
      },
    },
    sentiment: {
      control: 'inline-radio',
      options: ['positive', 'negative', 'neutral'],
      description:
        'Whether the change is good, bad or neutral — drives the color. The kit never assumes up = good.',
      table: {
        type: { summary: "'positive' | 'negative' | 'neutral'" },
        defaultValue: { summary: 'neutral' },
        category: 'Appearance',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      description:
        'Text and glyph size. `small` for tables / next to a Metric.',
      table: {
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: 'medium' },
        category: 'Appearance',
      },
    },
    variant: {
      control: 'inline-radio',
      options: ['inline', 'badge'],
      description:
        '`inline` = glyph + text; `badge` = the same in a compact status-tinted pill.',
      table: {
        type: { summary: "'inline' | 'badge'" },
        defaultValue: { summary: 'inline' },
        category: 'Appearance',
      },
    },
    value: {
      control: 'text',
      description:
        'Already-formatted change — numeric (`12%`, `3.5 h`) or qualitative (`Improving`). Never computed here.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    comparisonLabel: {
      control: 'text',
      description: 'Secondary comparison caption, e.g. "vs previous quarter".',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    tooltip: {
      control: 'text',
      description:
        'Contextual hint shown on hover/focus. Adds `tabIndex={0}` so the hint is not hover-only.',
      table: { type: { summary: 'ReactNode' }, category: 'Behavior' },
    },
    showIcon: {
      control: 'boolean',
      description:
        'Show the leading direction glyph. Defaults to `true` — color alone is not enough.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Appearance',
      },
    },
    ariaLabel: {
      control: 'text',
      description:
        'Full accessible sentence, applied via `role="img"`. Without it, assistive tech reads the visible text.',
      table: { type: { summary: 'string' }, category: 'State' },
    },
    className: {
      control: false,
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
  args: {
    direction: 'up',
    sentiment: 'positive',
    value: '12%',
    comparisonLabel: 'vs previous quarter',
    size: 'medium',
    variant: 'inline',
    showIcon: true,
  },
} satisfies Meta<typeof TrendIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {};

// Direction is not sentiment: the same arrow can be good or bad depending on the
// metric. The consumer decides `sentiment`; the kit never assumes up = good.
export const DirectionVsSentiment: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="8%"
        comparisonLabel="revenue QoQ"
      />
      <TrendIndicator
        direction="up"
        sentiment="negative"
        value="35%"
        comparisonLabel="threats this quarter"
      />
      <TrendIndicator
        direction="down"
        sentiment="positive"
        value="1.4 h"
        comparisonLabel="MTTR over 6 months"
      />
      <TrendIndicator
        direction="down"
        sentiment="negative"
        value="6 pts"
        comparisonLabel="health score"
      />
      <TrendIndicator
        direction="flat"
        sentiment="neutral"
        value="Stable"
        comparisonLabel="ticket volume"
      />
    </div>
  ),
};

// Qualitative (non-numeric) change.
export const Qualitative: Story = {
  args: {
    direction: 'up',
    sentiment: 'positive',
    value: 'Improving',
    comparisonLabel: undefined,
  },
};

// Compact tinted badge — for tables and dense headers.
export const Badge: Story = {
  args: { variant: 'badge', comparisonLabel: undefined },
};

export const BadgeSentiments: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <TrendIndicator
        variant="badge"
        direction="up"
        sentiment="positive"
        value="12%"
      />
      <TrendIndicator
        variant="badge"
        direction="down"
        sentiment="negative"
        value="8%"
      />
      <TrendIndicator
        variant="badge"
        direction="flat"
        sentiment="neutral"
        value="0%"
      />
    </div>
  ),
};

// Small size for inline use in tables / next to a Metric.
export const Small: Story = {
  args: { size: 'small' },
};

// No glyph (rarely needed — the icon reinforces meaning beyond color).
export const NoIcon: Story = {
  args: { showIcon: false },
};
