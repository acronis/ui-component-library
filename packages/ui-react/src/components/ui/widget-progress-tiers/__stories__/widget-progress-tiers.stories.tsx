import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartPieIcon } from '@spec-lab/icons-react/stroke-mono';

import {
  WidgetProgressTiers,
  WidgetProgressTiersBar,
  WidgetProgressTiersFooter,
  WidgetProgressTiersHeader,
  WidgetProgressTiersIcon,
  WidgetProgressTiersLegend,
  WidgetProgressTiersLegendItem,
  WidgetProgressTiersTitle,
} from '../widget-progress-tiers';

const meta = {
  title: 'UI/WidgetProgressTiers',
  component: WidgetProgressTiers,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetProgressTiers>;

export default meta;
type Story = StoryObj<typeof meta>;

const tiers = [
  { label: 'Protected', value: 62, color: 'var(--ui-glyph-on-status-success)' },
  { label: 'At risk', value: 23, color: 'var(--ui-glyph-on-status-warning)' },
  { label: 'Unprotected', value: 15, color: 'var(--ui-glyph-on-status-danger)' },
];

export const Default: Story = {
  render: () => (
    <WidgetProgressTiers className="w-[360px]">
      <WidgetProgressTiersHeader>
        <WidgetProgressTiersIcon>
          <ChartPieIcon />
        </WidgetProgressTiersIcon>
        <WidgetProgressTiersTitle>Device protection</WidgetProgressTiersTitle>
      </WidgetProgressTiersHeader>
      <WidgetProgressTiersBar tiers={tiers} />
      <WidgetProgressTiersLegend>
        {tiers.map((tier) => (
          <WidgetProgressTiersLegendItem
            key={tier.label}
            color={tier.color}
            label={tier.label}
            value={tier.value}
          />
        ))}
      </WidgetProgressTiersLegend>
    </WidgetProgressTiers>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <WidgetProgressTiers className="w-[360px]">
      <WidgetProgressTiersHeader>
        <WidgetProgressTiersIcon>
          <ChartPieIcon />
        </WidgetProgressTiersIcon>
        <WidgetProgressTiersTitle>Ticket status</WidgetProgressTiersTitle>
      </WidgetProgressTiersHeader>
      <WidgetProgressTiersBar tiers={tiers} />
      <WidgetProgressTiersLegend>
        {tiers.map((tier) => (
          <WidgetProgressTiersLegendItem
            key={tier.label}
            color={tier.color}
            label={tier.label}
            value={tier.value}
          />
        ))}
      </WidgetProgressTiersLegend>
      <WidgetProgressTiersFooter>100 devices total</WidgetProgressTiersFooter>
    </WidgetProgressTiers>
  ),
};

export const Interactive: Story = {
  render: () => (
    <WidgetProgressTiers interactive className="w-[360px]">
      <WidgetProgressTiersHeader>
        <WidgetProgressTiersIcon>
          <ChartPieIcon />
        </WidgetProgressTiersIcon>
        <WidgetProgressTiersTitle>Click for details</WidgetProgressTiersTitle>
      </WidgetProgressTiersHeader>
      <WidgetProgressTiersBar tiers={tiers} />
      <WidgetProgressTiersLegend>
        {tiers.map((tier) => (
          <WidgetProgressTiersLegendItem
            key={tier.label}
            color={tier.color}
            label={tier.label}
            value={tier.value}
          />
        ))}
      </WidgetProgressTiersLegend>
    </WidgetProgressTiers>
  ),
};

export const ExplicitTotal: Story = {
  render: () => (
    <WidgetProgressTiers className="w-[360px]">
      <WidgetProgressTiersHeader>
        <WidgetProgressTiersIcon>
          <ChartPieIcon />
        </WidgetProgressTiersIcon>
        <WidgetProgressTiersTitle>Quota (partial)</WidgetProgressTiersTitle>
      </WidgetProgressTiersHeader>
      <WidgetProgressTiersBar
        total={200}
        tiers={[{ label: 'Used', value: 80, color: 'var(--ui-glyph-on-status-info)' }]}
      />
      <WidgetProgressTiersLegend>
        <WidgetProgressTiersLegendItem
          color="var(--ui-glyph-on-status-info)"
          label="Used"
          value="80 / 200 GB"
        />
      </WidgetProgressTiersLegend>
    </WidgetProgressTiers>
  ),
};
