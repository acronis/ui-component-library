import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartPieIcon } from '@constructor-lab/icons-react/stroke-mono';
import { AcronisAiMultiIcon } from '@constructor-lab/icons-react/solid-multi';

import { Metric } from '../metric';
import { TrendIndicator } from '../../trend-indicator';
import { Tag } from '../../tag';
import { Separator } from '../../separator';
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '../../meter';

const meta = {
  title: 'UI/Metric',
  component: Metric,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    label: {
      control: 'text',
      description:
        'What the value measures. Rendered as a small uppercase note heading.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    value: {
      control: 'text',
      description:
        'The primary value, already formatted. The kit never formats currency, units or decimals.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    unit: {
      control: 'text',
      description: 'Unit beside the value, at a smaller muted size.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: 'Scales the label / value / unit / badge typography.',
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' },
        category: 'Appearance',
      },
    },
    status: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'danger', 'critical'],
      description:
        'Semantic status. Tints **only** the icon badge — never a full card fill.',
      table: {
        type: {
          summary:
            "'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'critical'",
        },
        defaultValue: { summary: 'neutral' },
        category: 'Appearance',
      },
    },
    loading: {
      control: 'boolean',
      description: 'Swap the value for a skeleton, preserving its space.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    supportingText: {
      control: 'text',
      description: 'Secondary line below the value — e.g. "Target: 99%".',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    tooltip: {
      control: 'text',
      description:
        'Contextual hint revealed by an info affordance next to the label.',
      table: { type: { summary: 'ReactNode' }, category: 'Behavior' },
    },
    tooltipLabel: {
      control: 'text',
      description: 'Accessible name for that info affordance.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'More information'" },
        category: 'Behavior',
      },
    },
    caption: {
      control: false,
      description: 'Top-right caption aligned with the label — e.g. a `Tag`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    trend: {
      control: false,
      description:
        'Trend slot to the right of the value — typically a `TrendIndicator`.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    icon: {
      control: false,
      description: 'Icon rendered inside the status-tinted badge.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    badge: {
      control: false,
      description: 'Small metadata slot beside the value — e.g. a `Tag`.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    children: {
      control: false,
      description:
        'Card body below the header — a chart, a `Meter` breakdown, a `Separator`.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    className: {
      control: false,
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
  args: {
    label: 'Gross margin',
    value: '73',
    unit: '%',
    size: 'medium',
    status: 'neutral',
    loading: false,
    className: 'w-[320px]',
  },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// The full metric-card header: a caption top-right and a trend to the right of
// the value, with a status-tinted icon badge.
export const WithCaptionAndTrend: Story = {
  args: {
    status: 'critical',
    icon: <ChartPieIcon />,
    caption: (
      <Tag variant="neutral" size="sm">
        Last 30 days
      </Tag>
    ),
    trend: (
      <TrendIndicator
        direction="down"
        sentiment="negative"
        value="5%"
        comparisonLabel="vs prev 30d"
        size="small"
      />
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Metric
        className="w-[260px]"
        label="Coverage"
        value="94"
        unit="%"
        size="small"
        icon={<ChartPieIcon />}
      />
      <Metric
        className="w-[260px]"
        label="Coverage"
        value="94"
        unit="%"
        size="medium"
        icon={<ChartPieIcon />}
      />
      <Metric
        className="w-[260px]"
        label="Coverage"
        value="94"
        unit="%"
        size="large"
        icon={<ChartPieIcon />}
      />
    </div>
  ),
};

// Status tints the icon badge — a subtle cue, never a full color fill. The six
// statuses map to the semantic status token families (icon = text-on-status,
// badge = status-*-pressed), the same pairing Timeline's status marker uses.
export const Statuses: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Metric
        className="w-[240px]"
        label="Info"
        value="12"
        status="info"
        icon={<ChartPieIcon />}
      />
      <Metric
        className="w-[240px]"
        label="Danger"
        value="3"
        status="danger"
        icon={<ChartPieIcon />}
      />
      <Metric
        className="w-[240px]"
        label="Critical"
        value="7"
        status="critical"
        icon={<ChartPieIcon />}
      />
      <Metric
        className="w-[240px]"
        label="Success"
        value="94"
        unit="%"
        status="success"
        icon={<ChartPieIcon />}
      />
      <Metric
        className="w-[240px]"
        label="Warning"
        value="95"
        unit="%"
        status="warning"
        icon={<ChartPieIcon />}
      />
      <Metric
        className="w-[240px]"
        label="Neutral"
        value="128"
        status="neutral"
        icon={<ChartPieIcon />}
      />
    </div>
  ),
};

export const WithSupportingText: Story = {
  args: {
    label: 'SLA compliance',
    value: '95',
    unit: '%',
    status: 'warning',
    icon: <ChartPieIcon />,
    supportingText: 'Target: 99%',
    trend: (
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="2.5%"
        size="small"
      />
    ),
  },
};

// No data is not zero — show an em dash.
export const NoData: Story = {
  args: {
    label: 'Health score',
    value: '—',
    unit: undefined,
    supportingText: 'Not enough historical data',
  },
};

// Loading preserves the value's space with a skeleton.
export const Loading: Story = {
  args: { loading: true, icon: <ChartPieIcon /> },
};

// An info affordance next to the label reveals the tooltip.
export const WithTooltip: Story = {
  args: {
    label: 'ARR',
    value: '$72K',
    unit: undefined,
    tooltip: 'Annual recurring revenue projected for the next 12 months.',
    tooltipLabel: 'About ARR',
  },
};

// A compact breakdown row built from our compositional `Meter` parts: a
// label + value line above a track whose indicator carries the status color.
function BreakdownRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <Meter value={value} max={max} className="gap-1">
      <div className="flex items-center justify-between">
        <MeterLabel className="text-xs font-normal">{label}</MeterLabel>
        <MeterValue className="text-xs" />
      </div>
      <MeterTrack className="h-1.5">
        <MeterIndicator style={{ background: color }} />
      </MeterTrack>
    </Meter>
  );
}

// A real dashboard tile composed from our primitives: Metric owns the data
// header (caption + icon badge + value + a composed TrendIndicator); the body
// (children) is a Meter breakdown, a Separator, and an AI-insight footer.
export const InDashboardCard: Story = {
  render: () => (
    <Metric
      className="w-[314px]"
      label="At-risk customers"
      status="critical"
      icon={<ChartPieIcon />}
      caption={
        <Tag variant="neutral" size="sm">
          Now
        </Tag>
      }
      value="3"
      trend={
        <TrendIndicator
          direction="up"
          sentiment="negative"
          value="1 this week"
          size="small"
        />
      }
    >
      <div className="mt-3 flex flex-col gap-2.5">
        <BreakdownRow
          label="Healthy"
          value={46}
          max={54}
          color="var(--ui-background-status-strong-success)"
        />
        <BreakdownRow
          label="Unhealthy"
          value={5}
          max={54}
          color="var(--ui-background-status-strong-warning)"
        />
        <BreakdownRow
          label="At risk"
          value={3}
          max={54}
          color="var(--ui-background-status-strong-critical)"
        />
      </div>
      <Separator className="my-3" />
      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <AcronisAiMultiIcon size={16} aria-hidden className="mt-0.5 shrink-0" />
        +3 customers predicted at-risk within 30 days — act before renewal.
      </p>
    </Metric>
  ),
};
