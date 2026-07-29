import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import { ConfidenceCone } from '../confidence-cone';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

// A revenue projection: history through Apr (the band collapses onto the line),
// then a forecast whose confidence band widens into a cone. The line and band
// colors are caller-supplied via `config`, bound to the theme-invariant
// `--ui-chart-*` palette.
const data = [
  { month: 'Jan', estimate: 100, lower: 100, upper: 100 },
  { month: 'Feb', estimate: 106, lower: 106, upper: 106 },
  { month: 'Mar', estimate: 111, lower: 111, upper: 111 },
  { month: 'Apr', estimate: 118, lower: 118, upper: 118 },
  { month: 'May', estimate: 124, lower: 118, upper: 130 },
  { month: 'Jun', estimate: 131, lower: 120, upper: 143 },
  { month: 'Jul', estimate: 138, lower: 121, upper: 156 },
  { month: 'Aug', estimate: 146, lower: 123, upper: 171 },
];

const config = {
  estimate: { label: 'Estimate', color: 'var(--ui-chart-1)' },
  band: { label: 'Confidence', color: 'var(--ui-chart-1)' },
} satisfies ChartConfig;

const meta = {
  title: 'UI/ConfidenceCone',
  component: ConfidenceCone,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark.
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    config,
    data,
    xKey: 'month',
    valueKey: 'estimate',
    lowerKey: 'lower',
    upperKey: 'upper',
    bandKey: 'band',
    bandOpacity: 0.2,
    curve: 'monotone',
    strokeWidth: 2,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[360px] w-[560px]',
  },
  argTypes: {
    bandOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
    curve: { control: 'inline-radio', options: ['linear', 'monotone', 'step'] },
    strokeWidth: { control: { type: 'number', min: 1, max: 6 } },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof ConfidenceCone>;

export default meta;
type Story = StoryObj<typeof meta>;

// The estimate line inside its widening confidence band (default).
export const Default: Story = {};

// A dashed divider marking where the projection begins.
export const WithForecastDivider: Story = {
  args: { forecastStart: 'Apr', forecastLabel: 'Forecast' },
};

// Grid + tooltip + legend toggled off — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showGrid: false, showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition (band tuple stamped by hand) so recharts' `defaultIndex`
// can open the tooltip statically for the visual-regression baseline.
const bandData = data.map((d) => ({ ...d, band: [d.lower, d.upper] }));

export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[560px]">
      <ComposedChart data={bandData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          defaultIndex={6}
          active
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="band"
          stroke="none"
          fill="var(--color-band)"
          fillOpacity={0.2}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="estimate"
          stroke="var(--color-estimate)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    labelFormatter={(label) => `Month: ${label}`}
    formatter={(value, name) => `${name}: ${JSON.stringify(value)}`}
  />
);

// Customize the tooltip through the component's `tooltipContent` prop — this is
// the usage example (autodocs). The tooltip is hover-only, so it isn't painted
// here; `CustomTooltipOpen` below is the visual-regression case.
export const CustomTooltip: Story = {
  args: { tooltipContent: customTooltipContent },
};

// The same custom tooltip, forced open for the VR baseline: like `TooltipOpen`,
// this renders the raw composition with the shared custom content wired in.
export const CustomTooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[560px]">
      <ComposedChart data={bandData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip defaultIndex={6} active content={customTooltipContent} />
        <ReferenceLine
          x="Apr"
          stroke="var(--ui-text-on-surface-secondary)"
          strokeDasharray="4 4"
          label={{
            value: 'Forecast',
            position: 'insideTopRight',
            fill: 'var(--ui-text-on-surface-secondary)',
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="band"
          stroke="none"
          fill="var(--color-band)"
          fillOpacity={0.2}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="estimate"
          stroke="var(--color-estimate)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  ),
};
