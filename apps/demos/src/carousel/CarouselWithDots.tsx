import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@spec-lab/ui-react';
import { Card, CardContent } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@spec-lab/icons-react/stroke-mono';
export function CarouselWithDots() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    // eslint-disable-next-line @eslint-react/set-state-in-effect -- initial sync from the embla carousel api once it is available
    setCount(api.scrollSnapList().length);
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- initial sync from the embla carousel api once it is available
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full max-w-xs mx-auto">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key -- fixed-length static demo array with no stable id
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex items-center justify-center gap-4 mt-4">
        <Button
          variant="ghost"
          onClick={() => api?.scrollPrev()}
          disabled={!api?.canScrollPrev()}
          className="text-[hsl(var(--carousel-nav-text))] disabled:text-[hsl(var(--carousel-nav-text-disabled)/0.3)]"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Prev
        </Button>
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              // eslint-disable-next-line @eslint-react/no-array-index-key -- dot index is the stable identity of each slide indicator
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index + 1 === current
                  ? 'w-2 bg-[hsl(var(--carousel-dot-active))]'
                  : 'w-2 bg-[hsl(var(--carousel-dot)/0.3)]'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() => api?.scrollNext()}
          disabled={!api?.canScrollNext()}
          className="text-[hsl(var(--carousel-nav-text))] disabled:text-[hsl(var(--carousel-nav-text-disabled)/0.3)]"
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
