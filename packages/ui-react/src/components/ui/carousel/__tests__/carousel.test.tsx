import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from '../carousel';

function Basic() {
  return (
    <Carousel aria-label="Photos">
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselContent>
      <CarouselNavigation />
    </Carousel>
  );
}

describe('Carousel', () => {
  it('renders a carousel region with slide groups', () => {
    render(<Basic />);
    const region = screen.getByRole('region', { name: 'Photos' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    const slides = screen.getAllByRole('group');
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
  });

  it('renders the navigation bar: labelled prev / next links and a dots tablist', () => {
    render(<Basic />);
    expect(
      screen.getByRole('button', { name: 'Previous slide' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
    // The dot indicators live in a tablist (the mockup's pagination).
    expect(screen.getByRole('tablist', { name: 'Slides' })).toBeInTheDocument();
  });

  it('receives the embla api via setApi', () => {
    const setApi = vi.fn();
    render(
      <Carousel setApi={setApi} aria-label="c">
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(setApi).toHaveBeenCalled();
  });

  it('applies the vertical orientation layout to the content', () => {
    render(
      <Carousel orientation="vertical" aria-label="c">
        <CarouselContent data-testid="content">
          <CarouselItem>1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(screen.getByTestId('content')).toHaveClass('flex-col');
  });

  it('throws when a part is used outside <Carousel>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<CarouselContent />)).toThrow(/within a <Carousel/);
    spy.mockRestore();
  });

  it('forwards a ref to the carousel region', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Carousel ref={ref} aria-label="c">
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(ref.current).toHaveAttribute('aria-roledescription', 'carousel');
  });
});
