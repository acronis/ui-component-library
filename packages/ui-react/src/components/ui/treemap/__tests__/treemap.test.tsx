import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Treemap, type TreemapDatum } from '../treemap';
import { ChartTooltipContent, type ChartConfig } from '../../chart';

const data: TreemapDatum[] = [
  {
    name: 'Frontend',
    children: [
      { name: 'React', size: 3000 },
      { name: 'Vue', size: 2000 },
      { name: 'Angular', size: 1500 },
    ],
  },
  {
    name: 'Backend',
    children: [
      { name: 'Node.js', size: 2500 },
      { name: 'Python', size: 2200 },
    ],
  },
];

const config = {
  Frontend: { label: 'Frontend', color: 'rgb(65 105 225)' },
  Backend: { label: 'Backend', color: 'rgb(45 184 154)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof Treemap>> = {}
) {
  return render(
    <Treemap
      config={config}
      data={data}
      dataKey="size"
      nameKey="name"
      {...props}
    />
  );
}

describe('Treemap', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each category color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Frontend: rgb(65 105 225)');
    expect(style).toContain('--color-Backend: rgb(45 184 154)');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the tiles/labels can't be
  // asserted here. This exercises the geometry + label-toggle prop paths against
  // a plumbing/crash regression; the visual output is covered by the VR stories.
  it('renders with a custom aspectRatio and labels toggled off', () => {
    const { container } = renderChart({ aspectRatio: 1, showLabels: false });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[400px] w-full' });
    expect(container.firstElementChild).toHaveClass('h-[400px]', 'w-full');
  });

  // The `tooltipContent` prop forwards a custom (library-owned) ChartTooltipContent
  // to recharts' Tooltip; happy-dom doesn't paint the tooltip, so this only guards
  // the prop path — consumers customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent
          formatter={(value) => <span>{String(value)}</span>}
        />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
