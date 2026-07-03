import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from '../carousel';

const meta = {
  title: 'UI/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Scroll axis.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
        category: 'Behavior',
      },
    },
    opts: {
      control: false,
      description: 'Embla options (e.g. `{ loop: true, align: "start" }`).',
      table: { type: { summary: 'CarouselOptions' }, category: 'Behavior' },
    },
    plugins: { control: false, table: { category: 'Behavior' } },
    setApi: { control: false, table: { category: 'Events' } },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide = ({ n }: { n: number }) => (
  <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-muted text-4xl font-semibold text-foreground">
    {n}
  </div>
);

export const Default: Story = {
  render: (args) => (
    <Carousel {...args} className="w-72">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n}>
            <Slide n={n} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNavigation />
    </Carousel>
  ),
};

export const MultipleVisible: Story = {
  render: (args) => (
    <Carousel {...args} opts={{ align: 'start' }} className="w-80">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n} className="basis-1/3">
            <Slide n={n} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNavigation />
    </Carousel>
  ),
};
