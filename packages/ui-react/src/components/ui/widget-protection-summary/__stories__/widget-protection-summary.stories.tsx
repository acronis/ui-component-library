import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartPieIcon } from '@constructor-lab/icons-react/stroke-mono';

import {
  WidgetProtectionSummary,
  WidgetProtectionSummaryContent,
  WidgetProtectionSummaryDivider,
  WidgetProtectionSummaryFooter,
  WidgetProtectionSummaryHeader,
  WidgetProtectionSummaryIcon,
  WidgetProtectionSummaryRow,
  WidgetProtectionSummaryTitle,
} from '../widget-protection-summary';

const meta = {
  title: 'UI/WidgetProtectionSummary',
  component: WidgetProtectionSummary,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetProtectionSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WidgetProtectionSummary className="w-[320px]">
      <WidgetProtectionSummaryHeader>
        <WidgetProtectionSummaryIcon>
          <ChartPieIcon />
        </WidgetProtectionSummaryIcon>
        <WidgetProtectionSummaryTitle>
          Protection summary
        </WidgetProtectionSummaryTitle>
      </WidgetProtectionSummaryHeader>
      <WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryRow
          label="Protected"
          value={128}
          status="success"
        />
        <WidgetProtectionSummaryRow
          label="At risk"
          value={4}
          status="warning"
        />
        <WidgetProtectionSummaryRow
          label="Unprotected"
          value={2}
          status="critical"
        />
      </WidgetProtectionSummaryContent>
      <WidgetProtectionSummaryDivider />
      <WidgetProtectionSummaryFooter>
        Updated 2 min ago
      </WidgetProtectionSummaryFooter>
    </WidgetProtectionSummary>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <WidgetProtectionSummary className="w-[320px]">
      <WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryRow
          label="Success"
          value={1}
          status="success"
        />
        <WidgetProtectionSummaryRow
          label="Warning"
          value={2}
          status="warning"
        />
        <WidgetProtectionSummaryRow
          label="Critical"
          value={3}
          status="critical"
        />
        <WidgetProtectionSummaryRow label="Danger" value={4} status="danger" />
        <WidgetProtectionSummaryRow label="Info" value={5} status="info" />
        <WidgetProtectionSummaryRow
          label="Neutral"
          value={6}
          status="neutral"
        />
        <WidgetProtectionSummaryRow label="No status" value={7} />
      </WidgetProtectionSummaryContent>
    </WidgetProtectionSummary>
  ),
};

export const Interactive: Story = {
  render: () => (
    <WidgetProtectionSummary interactive className="w-[320px]">
      <WidgetProtectionSummaryHeader>
        <WidgetProtectionSummaryIcon>
          <ChartPieIcon />
        </WidgetProtectionSummaryIcon>
        <WidgetProtectionSummaryTitle>
          Click to open
        </WidgetProtectionSummaryTitle>
      </WidgetProtectionSummaryHeader>
      <WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryRow
          label="Protected"
          value={128}
          status="success"
        />
        <WidgetProtectionSummaryRow
          label="At risk"
          value={4}
          status="warning"
        />
      </WidgetProtectionSummaryContent>
    </WidgetProtectionSummary>
  ),
};
