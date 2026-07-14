'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from '@constructor-lab/ui-react';

const Slide = ({ n }: { n: number }) => (
  <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-muted text-4xl font-semibold text-foreground">
    {n}
  </div>
);

export function CarouselDemo() {
  return (
    <Carousel className="w-72">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n}>
            <Slide n={n} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNavigation />
    </Carousel>
  );
}

export function CarouselMultipleDemo() {
  return (
    <Carousel opts={{ align: 'start' }} className="w-80">
      <CarouselContent>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <CarouselItem key={n} className="basis-1/3">
            <Slide n={n} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNavigation />
    </Carousel>
  );
}
