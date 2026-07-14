import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartBarVerticalIcon,
  EllipsisIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import {
  Widget,
  WidgetActions,
  WidgetContent,
  WidgetDivider,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  WidgetLabel,
  WidgetTitle,
  WidgetValue,
} from '../widget';

const meta = {
  title: 'UI/Widget',
  component: Widget,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    interactive: { control: 'boolean' },
  },
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Widget {...args} className="w-[320px]">
      <WidgetHeader>
        <WidgetIcon>
          <ChartBarVerticalIcon />
        </WidgetIcon>
        <WidgetTitle>Backup usage</WidgetTitle>
        <WidgetActions>
          <EllipsisIcon />
        </WidgetActions>
      </WidgetHeader>
      <WidgetContent>
        <WidgetValue>1.2 TB</WidgetValue>
        <WidgetLabel>of 2 TB used</WidgetLabel>
      </WidgetContent>
      <WidgetFooter>Last checked: today</WidgetFooter>
    </Widget>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Widget key={size} size={size} className="w-[220px]">
          <WidgetHeader>
            <WidgetTitle>Size: {size}</WidgetTitle>
          </WidgetHeader>
          <WidgetContent>
            <WidgetValue>42</WidgetValue>
            <WidgetLabel>events</WidgetLabel>
          </WidgetContent>
        </Widget>
      ))}
    </div>
  ),
};

export const WithDivider: Story = {
  render: () => (
    <Widget className="w-[320px]">
      <WidgetHeader>
        <WidgetIcon>
          <ChartBarVerticalIcon />
        </WidgetIcon>
        <WidgetTitle>Protection status</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        <WidgetValue>18 / 20</WidgetValue>
        <WidgetLabel>devices protected</WidgetLabel>
      </WidgetContent>
      <WidgetDivider />
      <WidgetFooter>Last checked: never</WidgetFooter>
    </Widget>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Widget interactive className="w-[320px]">
      <WidgetHeader>
        <WidgetIcon>
          <ChartBarVerticalIcon />
        </WidgetIcon>
        <WidgetTitle>Click to configure</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        <WidgetValue>--</WidgetValue>
        <WidgetLabel>No data yet</WidgetLabel>
      </WidgetContent>
    </Widget>
  ),
};
