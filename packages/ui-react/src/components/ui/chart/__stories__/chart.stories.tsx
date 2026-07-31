import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

const meta = {
  title: 'UI/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Series colors are supplied by the caller via `config` — there is no chart token
// tier yet, so these reference the shared semantic status/brand tokens (a
// dedicated data-viz palette is pending an upstream design pass).
const seriesData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const seriesConfig = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: {
    label: 'Mobile',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

export const Bars: Story = {
  args: { config: seriesConfig, children: <span /> },
  render: () => (
    <ChartContainer config={seriesConfig} className="h-[300px] w-[500px]">
      <BarChart data={seriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={4}
          isAnimationActive={false}
        />
        <Bar
          dataKey="mobile"
          fill="var(--color-mobile)"
          radius={4}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  ),
};

// The tooltip is hover-only, so the default static stories never render it and a
// visual-regression snapshot can't see its themed surface (radius / padding /
// shadow tokens). `defaultIndex` forces recharts to open it at a data point on
// mount so the snapshot captures it. animationDelay lets it settle.
export const TooltipOpen: Story = {
  parameters: { snapshot: { animationDelay: 400 } },
  args: { config: seriesConfig, children: <span /> },
  render: () => (
    <ChartContainer config={seriesConfig} className="h-[300px] w-[500px]">
      <BarChart data={seriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip defaultIndex={1} content={<ChartTooltipContent />} />
        <Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={4}
          isAnimationActive={false}
        />
        <Bar
          dataKey="mobile"
          fill="var(--color-mobile)"
          radius={4}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  ),
};

export const Lines: Story = {
  args: { config: seriesConfig, children: <span /> },
  render: () => (
    <ChartContainer config={seriesConfig} className="h-[300px] w-[500px]">
      <LineChart data={seriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  ),
};

export const Areas: Story = {
  args: { config: seriesConfig, children: <span /> },
  render: () => (
    <ChartContainer config={seriesConfig} className="h-[300px] w-[500px]">
      <AreaChart data={seriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.2}
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.2}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

const pieData = [
  { name: 'Chrome', value: 400 },
  { name: 'Firefox', value: 300 },
  { name: 'Safari', value: 200 },
  { name: 'Edge', value: 100 },
];

const pieConfig = {
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-danger)',
  },
  Safari: {
    label: 'Safari',
    color: 'var(--ui-background-status-strong-warning)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-success)' },
} satisfies ChartConfig;

export const Pies: Story = {
  args: { config: pieConfig, children: <span /> },
  render: () => (
    <ChartContainer config={pieConfig} className="h-[300px] w-[400px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          isAnimationActive={false}
        >
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  ),
};

const stackedData = [
  { month: 'Jan', desktop: 186, mobile: 80, tablet: 40 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'Apr', desktop: 73, mobile: 190, tablet: 30 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 80 },
];

const stackedConfig = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: {
    label: 'Mobile',
    color: 'var(--ui-background-status-strong-danger)',
  },
  tablet: {
    label: 'Tablet',
    color: 'var(--ui-background-status-strong-success)',
  },
} satisfies ChartConfig;

export const StackedBars: Story = {
  args: { config: stackedConfig, children: <span /> },
  render: () => (
    <ChartContainer config={stackedConfig} className="h-[300px] w-[500px]">
      <BarChart data={stackedData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          stackId="a"
          fill="var(--color-desktop)"
          isAnimationActive={false}
        />
        <Bar
          dataKey="mobile"
          stackId="a"
          fill="var(--color-mobile)"
          isAnimationActive={false}
        />
        <Bar
          dataKey="tablet"
          stackId="a"
          fill="var(--color-tablet)"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  ),
};

// ── The `theme` branch of ChartConfig, which nothing else covers ──────────────
// A series can supply either a single `color` or a per-theme `theme: { light,
// dark }` pair. Every other story here uses `color`, so `ChartStyle`'s two
// emitted blocks carry the SAME value and the light/dark baselines are identical
// in the one region that distinguishes them — the code path is exercised, the
// behaviour is not.
//
// That matters beyond ordinary coverage: `ChartStyle` scopes the dark block with
// a literal `[data-theme='dark']` selector rather than a token, so it is the one
// place in the library where dark styling cannot follow the OS. This story is
// what lets the `system-dark` capture profile SEE that — with identical colours
// there is no pixel for it to differ on. Deliberately high-contrast between the
// two values for the same reason: a subtle pair would sit under the 0.5% gate.
const perThemeConfig = {
  desktop: {
    label: 'Desktop',
    theme: {
      light: 'var(--ui-background-brand-secondary)',
      dark: 'var(--ui-background-status-strong-success)',
    },
  },
  mobile: {
    label: 'Mobile',
    theme: {
      light: 'var(--ui-background-status-strong-danger)',
      dark: 'var(--ui-background-status-strong-warning)',
    },
  },
} satisfies ChartConfig;

export const PerThemeSeriesColors: Story = {
  args: { config: perThemeConfig, children: <span /> },
  render: () => (
    <ChartContainer config={perThemeConfig} className="h-[300px] w-[500px]">
      <BarChart data={seriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={4}
          isAnimationActive={false}
        />
        <Bar
          dataKey="mobile"
          fill="var(--color-mobile)"
          radius={4}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  ),
};
