'use client';

import * as React from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '../button';

// Ported from the legacy shadcn UI kit's `carousel` — a slideshow built on the headless
// `embla-carousel-react` engine (drag, snap, loop, orientation, autoplay
// plugins). Composable parts share one embla instance via context.
//
// Adaptations from legacy:
// - The **navigation representation follows the legacy Figma mockup** (node
//   966-87218): a bottom bar of a "← Prev" text link, dot indicators marking the
//   active slide, and a "Next →" text link — not shadcn's round overlay arrows.
//   `CarouselNavigation` lays the three out; `CarouselDots` is wired to embla's
//   snap list.
// - Prev/Next use ui-react's ghost `Button` (text + arrow); the dots and links
//   resolve to `--ui-*` tokens (the blue info gamma for the active dot). No color
//   is hand-authored.

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

export interface CarouselProps {
  /** Embla options (e.g. `{ loop: true, align: 'start' }`). */
  opts?: CarouselOptions;
  /** Embla plugins (e.g. Autoplay). */
  plugins?: CarouselPlugin;
  /** Scroll axis. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Receive the embla api for imperative control. */
  setApi?: (api: CarouselApi) => void;
}

interface CarouselContextValue extends CarouselProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  orientation: 'horizontal' | 'vertical';
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
  const context = React.use(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />.');
  }
  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onSelect = React.useCallback((embla: CarouselApi) => {
      if (!embla) return;
      // Syncs React state from the imperative Embla instance, which only exists
      // after mount; also runs as Embla's 'select'/'reInit' event handler.
      /* eslint-disable @eslint-react/set-state-in-effect */
      setCanScrollPrev(embla.canScrollPrev());
      setCanScrollNext(embla.canScrollNext());
      setSelectedIndex(embla.selectedScrollSnap());
      /* eslint-enable @eslint-react/set-state-in-effect */
    }, []);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
    const scrollTo = React.useCallback(
      (index: number) => api?.scrollTo(index),
      [api]
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- initial sync of snap points from the imperative Embla instance, available only after mount
      setScrollSnaps(api.scrollSnapList());
      onSelect(api);
      const onReInit = (embla: CarouselApi) => {
        if (embla) setScrollSnaps(embla.scrollSnapList());
        onSelect(embla);
      };
      api.on('reInit', onReInit);
      api.on('select', onSelect);
      return () => {
        api.off('reInit', onReInit);
        api.off('select', onSelect);
      };
    }, [api, onSelect]);

    const value = React.useMemo<CarouselContextValue>(
      () => ({
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
      }),
      [
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
      ]
    );

    return (
      <CarouselContext value={value}>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext>
    );
  }
);
Carousel.displayName = 'Carousel';

export type CarouselContentProps = React.HTMLAttributes<HTMLDivElement>;

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return (
      <div
        ref={carouselRef}
        className="overflow-hidden"
        data-slot="carousel-viewport"
      >
        <div
          ref={ref}
          data-slot="carousel-content"
          className={cn(
            'flex',
            orientation === 'horizontal' ? '-ms-4' : '-mt-4 flex-col',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = 'CarouselContent';

export type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>;

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        data-slot="carousel-item"
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-full',
          orientation === 'horizontal' ? 'ps-4' : 'pt-4',
          className
        )}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = 'CarouselItem';

export interface CarouselPreviousProps extends Omit<ButtonProps, 'variant'> {
  /** Override the visible label. Defaults to "Prev". */
  children?: React.ReactNode;
}

// "← Prev" text link (mockup). Disabled at the start unless looping.
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselPreviousProps
>(({ className, children = 'Prev', ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant="ghost"
      aria-label="Previous slide"
      className={cn('gap-1', className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon />
      {children}
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

export type CarouselNextProps = CarouselPreviousProps;

// "Next →" text link (mockup). Disabled at the end unless looping.
const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, children = 'Next', ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();
    return (
      <Button
        ref={ref}
        variant="ghost"
        aria-label="Next slide"
        className={cn('gap-1', className)}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        {children}
        <ArrowRightIcon />
      </Button>
    );
  }
);
CarouselNext.displayName = 'CarouselNext';

export type CarouselDotsProps = React.HTMLAttributes<HTMLDivElement>;

// Pagination dots (mockup) — one per snap, active dot in the blue info gamma.
const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className, ...props }, ref) => {
    const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();
    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Slides"
        data-slot="carousel-dots"
        className={cn('flex items-center justify-center gap-2', className)}
        {...props}
      >
        {scrollSnaps.map((_, index) => {
          const active = index === selectedIndex;
          return (
            <button
              // eslint-disable-next-line @eslint-react/no-array-index-key -- pagination dots map 1:1 to slides by position; the index is the stable identity
              key={index}
              type="button"
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={active}
              data-active={active || undefined}
              onClick={() => scrollTo(index)}
              className={cn(
                'size-2 rounded-full transition-colors',
                active
                  ? 'bg-[var(--ui-background-status-strong-info)]'
                  : 'bg-[var(--ui-border-on-status-info)] hover:bg-[var(--ui-background-status-strong-info)]'
              )}
            />
          );
        })}
      </div>
    );
  }
);
CarouselDots.displayName = 'CarouselDots';

export type CarouselNavigationProps = React.HTMLAttributes<HTMLDivElement>;

// The mockup's bottom nav bar: [← Prev]  • • • •  [Next →].
const CarouselNavigation = React.forwardRef<
  HTMLDivElement,
  CarouselNavigationProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="carousel-navigation"
    className={cn('mt-4 flex items-center justify-between gap-4', className)}
    {...props}
  >
    <CarouselPrevious />
    <CarouselDots />
    <CarouselNext />
  </div>
));
CarouselNavigation.displayName = 'CarouselNavigation';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselNavigation,
};
