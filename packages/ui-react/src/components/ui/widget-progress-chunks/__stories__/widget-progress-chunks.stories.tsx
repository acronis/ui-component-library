import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartBarVerticalIcon } from '@spec-lab/icons-react/stroke-mono';

import {
  WidgetProgressChunkRow,
  WidgetProgressChunks,
  WidgetProgressChunksBody,
  WidgetProgressChunksFooter,
  WidgetProgressChunksHeader,
  WidgetProgressChunksIcon,
  WidgetProgressChunksTitle,
} from '../widget-progress-chunks';

const meta = {
  title: 'UI/WidgetProgressChunks',
  component: WidgetProgressChunks,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetProgressChunks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WidgetProgressChunks className="w-[320px]">
      <WidgetProgressChunksHeader>
        <WidgetProgressChunksIcon>
          <ChartBarVerticalIcon />
        </WidgetProgressChunksIcon>
        <WidgetProgressChunksTitle>Storage usage</WidgetProgressChunksTitle>
      </WidgetProgressChunksHeader>
      <WidgetProgressChunksBody>
        <WidgetProgressChunkRow
          label="Photos"
          value={32}
          total={100}
          color="var(--ui-glyph-on-status-info)"
        />
        <WidgetProgressChunkRow
          label="Videos"
          value={48}
          total={100}
          color="var(--ui-glyph-on-status-success)"
        />
        <WidgetProgressChunkRow
          label="Documents"
          value={12}
          total={100}
          color="var(--ui-glyph-on-status-warning)"
        />
      </WidgetProgressChunksBody>
    </WidgetProgressChunks>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <WidgetProgressChunks className="w-[320px]">
      <WidgetProgressChunksHeader>
        <WidgetProgressChunksIcon>
          <ChartBarVerticalIcon />
        </WidgetProgressChunksIcon>
        <WidgetProgressChunksTitle>Backup jobs</WidgetProgressChunksTitle>
      </WidgetProgressChunksHeader>
      <WidgetProgressChunksBody>
        <WidgetProgressChunkRow
          label="Completed"
          value={18}
          total={20}
          color="var(--ui-glyph-on-status-success)"
        />
        <WidgetProgressChunkRow
          label="Failed"
          value={2}
          total={20}
          color="var(--ui-glyph-on-status-danger)"
        />
      </WidgetProgressChunksBody>
      <WidgetProgressChunksFooter>
        Last run: 2 hours ago
      </WidgetProgressChunksFooter>
    </WidgetProgressChunks>
  ),
};

export const Interactive: Story = {
  render: () => (
    <WidgetProgressChunks interactive className="w-[320px]">
      <WidgetProgressChunksHeader>
        <WidgetProgressChunksIcon>
          <ChartBarVerticalIcon />
        </WidgetProgressChunksIcon>
        <WidgetProgressChunksTitle>Click for details</WidgetProgressChunksTitle>
      </WidgetProgressChunksHeader>
      <WidgetProgressChunksBody>
        <WidgetProgressChunkRow
          label="Used"
          value={64}
          total={100}
          color="var(--ui-glyph-on-status-info)"
        />
      </WidgetProgressChunksBody>
    </WidgetProgressChunks>
  ),
};

export const CustomFormatting: Story = {
  render: () => (
    <WidgetProgressChunks className="w-[320px]">
      <WidgetProgressChunksHeader>
        <WidgetProgressChunksIcon>
          <ChartBarVerticalIcon />
        </WidgetProgressChunksIcon>
        <WidgetProgressChunksTitle>Bandwidth</WidgetProgressChunksTitle>
      </WidgetProgressChunksHeader>
      <WidgetProgressChunksBody>
        <WidgetProgressChunkRow
          label="Uplink"
          value={1024}
          total={2048}
          color="var(--ui-glyph-on-status-info)"
          formatValue={(v) => `${(v / 1024).toFixed(1)} GB`}
          formatTotal={(t) => `${(t / 1024).toFixed(1)} GB`}
        />
      </WidgetProgressChunksBody>
    </WidgetProgressChunks>
  ),
};
