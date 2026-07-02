import type { Meta, StoryObj } from '@storybook/react-vite';

import { AspectRatio } from '../aspect-ratio';

// Network-free placeholder content (VR stories must not fetch remote assets).
function Box({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
      {label}
    </div>
  );
}

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  args: { ratio: 1 },
  argTypes: {
    ratio: {
      control: { type: 'number', step: 0.1 },
      description:
        'Width-to-height ratio (e.g. `16 / 9`, `4 / 3`, `1`), applied via the native CSS `aspect-ratio` property.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'Layout',
      },
    },
    children: {
      control: false,
      description: 'The content constrained to the ratio (image, video, or any box).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the container.',
      table: { type: { summary: 'string' }, category: 'Layout' },
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <AspectRatio {...args}>
        <Box label={`${args.ratio ?? 1}`} />
      </AspectRatio>
    </div>
  ),
};

export const Widescreen: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args}>
        <Box label="16 : 9" />
      </AspectRatio>
    </div>
  ),
};

export const Ratios: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      <div className="w-40">
        <AspectRatio ratio={1}>
          <Box label="1 : 1" />
        </AspectRatio>
      </div>
      <div className="w-40">
        <AspectRatio ratio={4 / 3}>
          <Box label="4 : 3" />
        </AspectRatio>
      </div>
      <div className="w-40">
        <AspectRatio ratio={3 / 4}>
          <Box label="3 : 4" />
        </AspectRatio>
      </div>
    </div>
  ),
};
