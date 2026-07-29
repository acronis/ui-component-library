import type { Meta, StoryObj } from '@storybook/react-vite';
import { Treemap as RechartsTreemap } from 'recharts';

import { Treemap, type TreemapDatum } from '../treemap';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

// Category colors are supplied by the caller via `config`, keyed by each
// top-level entry's nameKey value and bound to the theme-invariant `--ui-chart-*`
// data-viz palette so a category keeps its identity across light and dark.
const data: TreemapDatum[] = [
  {
    name: 'Frontend',
    children: [
      { name: 'React', size: 3000 },
      { name: 'Vue', size: 2000 },
      { name: 'Angular', size: 1500 },
      { name: 'Svelte', size: 800 },
    ],
  },
  {
    name: 'Backend',
    children: [
      { name: 'Node.js', size: 2500 },
      { name: 'Python', size: 2200 },
      { name: 'Go', size: 1200 },
    ],
  },
  {
    name: 'Database',
    children: [
      { name: 'PostgreSQL', size: 1800 },
      { name: 'MongoDB', size: 1400 },
      { name: 'Redis', size: 900 },
    ],
  },
  {
    name: 'DevOps',
    children: [
      { name: 'Docker', size: 1600 },
      { name: 'Kubernetes', size: 1400 },
    ],
  },
];

const config = {
  Frontend: { label: 'Frontend', color: 'var(--ui-chart-1)' },
  Backend: { label: 'Backend', color: 'var(--ui-chart-2)' },
  Database: { label: 'Database', color: 'var(--ui-chart-3)' },
  DevOps: { label: 'DevOps', color: 'var(--ui-chart-4)' },
} satisfies ChartConfig;

const meta = {
  title: 'UI/Treemap',
  component: Treemap,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // gutters/labels but leaves the backdrop unthemed.
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
    dataKey: 'size',
    nameKey: 'name',
    aspectRatio: 4 / 3,
    showLabels: true,
    showTooltip: true,
    className: 'h-[400px] w-[560px]',
  },
  argTypes: {
    aspectRatio: { control: { type: 'number', min: 0.5, max: 4, step: 0.1 } },
    showLabels: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
  },
} satisfies Meta<typeof Treemap>;

export default meta;
type Story = StoryObj<typeof meta>;

// Categories packed into nested rectangles sized by value (default).
export const Default: Story = {};

// A squarer packing (aspectRatio 1).
export const Square: Story = {
  args: { aspectRatio: 1 },
};

// Labels + tooltip toggled off — the baseline that would catch a toggle silently
// becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showLabels: false, showTooltip: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[400px] w-[560px]">
      <RechartsTreemap
        data={data}
        dataKey="size"
        nameKey="name"
        aspectRatio={4 / 3}
        isAnimationActive={false}
        stroke="var(--ui-background-surface-primary)"
        fill="var(--color-Frontend)"
      >
        <ChartTooltip
          defaultIndex={0}
          active
          content={<ChartTooltipContent nameKey="name" hideLabel />}
        />
      </RechartsTreemap>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    nameKey="name"
    hideLabel
    formatter={(value, name) => (
      <div className="flex w-full items-center gap-2">
        <span className="capitalize text-muted-foreground">{name}</span>
        <span className="ms-auto font-mono font-medium tabular-nums">
          {Number(value).toLocaleString()}
        </span>
      </div>
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
// this renders the raw composition (recharts can't open a hover tooltip
// statically otherwise) with the shared custom content wired in.
export const CustomTooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[400px] w-[560px]">
      <RechartsTreemap
        data={data}
        dataKey="size"
        nameKey="name"
        aspectRatio={4 / 3}
        isAnimationActive={false}
        stroke="var(--ui-background-surface-primary)"
        fill="var(--color-Frontend)"
      >
        <ChartTooltip defaultIndex={0} active content={customTooltipContent} />
      </RechartsTreemap>
    </ChartContainer>
  ),
};
