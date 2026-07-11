import type { Meta, StoryObj } from '@storybook/react-vite';

import { Meter, MeterLabel, MeterValue, MeterTrack } from '../meter';

const meta = {
  title: 'UI/Meter',
  component: Meter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 72 },
  render: (args) => (
    <div className="w-[280px]">
      <Meter {...args}>
        <div className="flex items-center justify-between">
          <MeterLabel>Storage used</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack />
      </Meter>
    </div>
  ),
};

export const WithUnits: Story = {
  args: { value: 512 },
  render: () => (
    <div className="w-[280px]">
      <Meter
        value={512}
        min={0}
        max={1024}
        format={{ style: 'unit', unit: 'gigabyte' }}
      >
        <div className="flex items-center justify-between">
          <MeterLabel>Backup quota</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack />
      </Meter>
    </div>
  ),
};

export const Low: Story = {
  args: { value: 12 },
  render: () => (
    <div className="w-[280px]">
      <Meter value={12}>
        <div className="flex items-center justify-between">
          <MeterLabel>Password strength</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack />
      </Meter>
    </div>
  ),
};
