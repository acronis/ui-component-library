import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AspectRatio } from '../aspect-ratio';

describe('AspectRatio', () => {
  it('defaults to a square (aspect-ratio: 1)', () => {
    const { container } = render(<AspectRatio />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('relative', 'w-full');
    // The CSSOM normalizes a single-number aspect-ratio to `<n> / 1`.
    expect(el.style.aspectRatio).toBe('1 / 1');
  });

  it('applies the requested ratio', () => {
    const { container } = render(<AspectRatio ratio={16 / 9} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.aspectRatio).toBe(`${16 / 9} / 1`);
  });

  it('renders its children (the constrained content)', () => {
    render(
      <AspectRatio ratio={4 / 3}>
        <img data-testid="media" src="/x.jpg" alt="" />
      </AspectRatio>
    );
    expect(screen.getByTestId('media')).toBeInTheDocument();
  });

  it('merges className and preserves a caller-supplied style', () => {
    const { container } = render(
      <AspectRatio className="rounded-lg" style={{ maxWidth: 320 }} />
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('rounded-lg', 'w-full');
    expect(el.style.maxWidth).toBe('320px');
    expect(el.style.aspectRatio).toBe('1 / 1');
  });

  it('forwards the ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AspectRatio ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
