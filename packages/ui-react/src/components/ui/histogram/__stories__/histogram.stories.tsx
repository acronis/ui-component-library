import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import { Histogram, computeHistogramBins } from '../histogram';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

// A roughly bell-shaped distribution of response times (ms). The bar color is
// caller-supplied via `config`, bound to the theme-invariant `--ui-chart-*`
// palette so the series keeps its identity across light and dark.
const data = [
  12, 18, 22, 25, 25, 28, 30, 31, 33, 34, 35, 36, 36, 37, 38, 38, 39, 40, 40,
  41, 42, 42, 43, 44, 45, 46, 47, 48, 50, 52, 55, 58, 60, 63, 68, 72, 80, 88,
  95, 110,
];

const config = {
  count: { label: 'Requests', color: 'var(--ui-chart-1)' },
} satisfies ChartConfig;

const meta = {
  title: 'UI/Histogram',
  component: Histogram,
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
    seriesKey: 'count',
    bins: 10,
    barRadius: 2,
    showGrid: true,
    showTooltip: true,
    className: 'h-[340px] w-[520px]',
  },
  argTypes: {
    bins: { control: { type: 'number', min: 2, max: 30 } },
    barRadius: { control: { type: 'number', min: 0, max: 12 } },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
  },
} satisfies Meta<typeof Histogram>;

export default meta;
type Story = StoryObj<typeof meta>;

// The distribution bucketed into 10 equal-width bins (default).
export const Default: Story = {};

// Coarser binning — fewer, wider buckets.
export const FewerBins: Story = {
  args: { bins: 5 },
};

// Grid + tooltip toggled off — the baseline that would catch a toggle silently
// becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showGrid: false, showTooltip: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition (over the same binned data) so recharts' `defaultIndex`
// can open the tooltip statically for the visual-regression baseline.
const buckets = computeHistogramBins(data, 10).map((b) => ({
  ...b,
  count: b.count,
}));

export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[340px] w-[520px]">
      <RechartsBarChart data={buckets} barCategoryGap={0}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="bin"
          type="category"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          defaultIndex={4}
          active
          content={<ChartTooltipContent />}
        />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
      </RechartsBarChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    labelFormatter={(label) => `${label} ms`}
    formatter={(value) => (
      <span className="font-mono font-medium tabular-nums">
        {Number(value).toLocaleString()} requests
      </span>
    )}
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
    <ChartContainer config={config} className="h-[340px] w-[520px]">
      <RechartsBarChart data={buckets} barCategoryGap={0}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="bin"
          type="category"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip defaultIndex={4} active content={customTooltipContent} />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
      </RechartsBarChart>
    </ChartContainer>
  ),
};
