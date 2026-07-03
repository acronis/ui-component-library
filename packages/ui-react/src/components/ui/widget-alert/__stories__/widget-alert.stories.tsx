import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleTimesIcon,
  CircleWarningIcon,
  EllipsisIcon,
} from '@spec-lab/icons-react/stroke-mono';

import {
  WidgetAlert,
  WidgetAlertActions,
  WidgetAlertContent,
  WidgetAlertDate,
  WidgetAlertDescription,
  WidgetAlertIcon,
  WidgetAlertTitle,
} from '../widget-alert';

const meta = {
  title: 'UI/WidgetAlert',
  component: WidgetAlert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
      description: 'Status color of the alert surface + border.',
      table: { type: { summary: 'info | success | warning | danger' }, category: 'Appearance' },
    },
    interactive: {
      control: 'boolean',
      description: 'Makes the widget focusable/clickable with hover, active, and focus states.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
  },
} satisfies Meta<typeof WidgetAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => (
    <WidgetAlert variant="info" className="w-[420px]">
      <WidgetAlertIcon>
        <CircleInfoIcon />
      </WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Backup completed</WidgetAlertTitle>
        <WidgetAlertDate>Today, 10:32 AM</WidgetAlertDate>
      </WidgetAlertContent>
      <WidgetAlertActions>
        <EllipsisIcon />
      </WidgetAlertActions>
    </WidgetAlert>
  ),
};

export const Success: Story = {
  render: () => (
    <WidgetAlert variant="success" className="w-[420px]">
      <WidgetAlertIcon>
        <CircleCheckIcon />
      </WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Protection active</WidgetAlertTitle>
        <WidgetAlertDate>Today, 9:15 AM</WidgetAlertDate>
      </WidgetAlertContent>
      <WidgetAlertActions>
        <EllipsisIcon />
      </WidgetAlertActions>
    </WidgetAlert>
  ),
};

export const Warning: Story = {
  render: () => (
    <WidgetAlert variant="warning" className="w-[420px]">
      <WidgetAlertIcon>
        <CircleWarningIcon />
      </WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>License expiring soon</WidgetAlertTitle>
        <WidgetAlertDate>Expires in 7 days</WidgetAlertDate>
        <WidgetAlertDescription>
          Renew your license to continue protection.
        </WidgetAlertDescription>
      </WidgetAlertContent>
      <WidgetAlertActions>
        <EllipsisIcon />
      </WidgetAlertActions>
    </WidgetAlert>
  ),
};

export const Danger: Story = {
  render: () => (
    <WidgetAlert variant="danger" className="w-[420px]">
      <WidgetAlertIcon>
        <CircleTimesIcon />
      </WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Backup failed</WidgetAlertTitle>
        <WidgetAlertDate>Yesterday, 11:45 PM</WidgetAlertDate>
        <WidgetAlertDescription>
          Check your network connection and retry.
        </WidgetAlertDescription>
      </WidgetAlertContent>
      <WidgetAlertActions>
        <EllipsisIcon />
      </WidgetAlertActions>
    </WidgetAlert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-3">
      <WidgetAlert variant="info">
        <WidgetAlertIcon>
          <CircleInfoIcon />
        </WidgetAlertIcon>
        <WidgetAlertContent>
          <WidgetAlertTitle>Info alert</WidgetAlertTitle>
        </WidgetAlertContent>
      </WidgetAlert>
      <WidgetAlert variant="success">
        <WidgetAlertIcon>
          <CircleCheckIcon />
        </WidgetAlertIcon>
        <WidgetAlertContent>
          <WidgetAlertTitle>Success alert</WidgetAlertTitle>
        </WidgetAlertContent>
      </WidgetAlert>
      <WidgetAlert variant="warning">
        <WidgetAlertIcon>
          <CircleWarningIcon />
        </WidgetAlertIcon>
        <WidgetAlertContent>
          <WidgetAlertTitle>Warning alert</WidgetAlertTitle>
        </WidgetAlertContent>
      </WidgetAlert>
      <WidgetAlert variant="danger">
        <WidgetAlertIcon>
          <CircleTimesIcon />
        </WidgetAlertIcon>
        <WidgetAlertContent>
          <WidgetAlertTitle>Danger alert</WidgetAlertTitle>
        </WidgetAlertContent>
      </WidgetAlert>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <WidgetAlert variant="warning" interactive className="w-[420px]">
      <WidgetAlertIcon>
        <CircleWarningIcon />
      </WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Disk space running low</WidgetAlertTitle>
        <WidgetAlertDate>Today, 2:00 PM</WidgetAlertDate>
        <WidgetAlertDescription>
          Only 10% storage remaining. Click for details.
        </WidgetAlertDescription>
      </WidgetAlertContent>
      <WidgetAlertActions>
        <EllipsisIcon />
      </WidgetAlertActions>
    </WidgetAlert>
  ),
};
