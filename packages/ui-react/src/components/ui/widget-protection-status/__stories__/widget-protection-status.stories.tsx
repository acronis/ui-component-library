import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShieldCheckIcon } from '@spec-lab/icons-react/stroke-mono';

import {
  WidgetProtectionStatus,
  WidgetProtectionStatusContent,
  WidgetProtectionStatusFooter,
  WidgetProtectionStatusHeader,
  WidgetProtectionStatusIcon,
  WidgetProtectionStatusIndicator,
  WidgetProtectionStatusLabel,
  WidgetProtectionStatusTitle,
  WidgetProtectionStatusValue,
} from '../widget-protection-status';

const meta = {
  title: 'UI/WidgetProtectionStatus',
  component: WidgetProtectionStatus,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetProtectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WidgetProtectionStatus className="w-[280px]">
      <WidgetProtectionStatusHeader>
        <WidgetProtectionStatusIcon>
          <ShieldCheckIcon />
        </WidgetProtectionStatusIcon>
        <WidgetProtectionStatusTitle>
          Protection status
        </WidgetProtectionStatusTitle>
      </WidgetProtectionStatusHeader>
      <WidgetProtectionStatusContent>
        <WidgetProtectionStatusIndicator status="success">
          <WidgetProtectionStatusValue>128</WidgetProtectionStatusValue>
        </WidgetProtectionStatusIndicator>
        <WidgetProtectionStatusLabel>
          devices protected
        </WidgetProtectionStatusLabel>
      </WidgetProtectionStatusContent>
      <WidgetProtectionStatusFooter>
        Last checked: 2 min ago
      </WidgetProtectionStatusFooter>
    </WidgetProtectionStatus>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          ['success', '128'],
          ['warning', '12'],
          ['critical', '4'],
          ['danger', '2'],
          ['info', '36'],
          ['neutral', '0'],
        ] as const
      ).map(([status, value]) => (
        <WidgetProtectionStatus key={status} className="w-[280px]">
          <WidgetProtectionStatusContent>
            <WidgetProtectionStatusIndicator status={status}>
              <WidgetProtectionStatusValue>{value}</WidgetProtectionStatusValue>
            </WidgetProtectionStatusIndicator>
            <WidgetProtectionStatusLabel>{status}</WidgetProtectionStatusLabel>
          </WidgetProtectionStatusContent>
        </WidgetProtectionStatus>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <WidgetProtectionStatus interactive className="w-[280px]">
      <WidgetProtectionStatusHeader>
        <WidgetProtectionStatusIcon>
          <ShieldCheckIcon />
        </WidgetProtectionStatusIcon>
        <WidgetProtectionStatusTitle>Click to open</WidgetProtectionStatusTitle>
      </WidgetProtectionStatusHeader>
      <WidgetProtectionStatusContent>
        <WidgetProtectionStatusIndicator status="warning">
          <WidgetProtectionStatusValue>12</WidgetProtectionStatusValue>
        </WidgetProtectionStatusIndicator>
        <WidgetProtectionStatusLabel>
          devices at risk
        </WidgetProtectionStatusLabel>
      </WidgetProtectionStatusContent>
    </WidgetProtectionStatus>
  ),
};
