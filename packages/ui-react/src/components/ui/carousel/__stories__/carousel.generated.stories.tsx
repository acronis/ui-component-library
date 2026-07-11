// AUTO-GENERATED from @spec-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @spec-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CarouselContent, CarouselItem, CarouselNavigation } from '../carousel';
import { Carousel } from '../carousel';

const meta = {
  title: 'UI/Carousel/All States (generated)',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Carousel className="w-64">
        <CarouselContent>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n}>
              <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-muted text-4xl font-semibold text-foreground">
                {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation />
      </Carousel>
    </div>
  ),
};
