import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { TruncatedText } from '../truncated-text';

// happy-dom performs no layout, so scroll*/client* are always 0 (== "fits").
// Override them on the prototype to simulate an overflowing element, restore after.
const saved: Array<[string, PropertyDescriptor | undefined]> = [];

function simulateOverflow(props: Record<string, number>) {
  for (const [name, value] of Object.entries(props)) {
    saved.push([
      name,
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, name),
    ]);
    Object.defineProperty(HTMLElement.prototype, name, {
      configurable: true,
      get: () => value,
    });
  }
}

afterEach(() => {
  for (const [name, desc] of saved.splice(0)) {
    if (desc) Object.defineProperty(HTMLElement.prototype, name, desc);
    else Reflect.deleteProperty(HTMLElement.prototype, name);
  }
});

describe('TruncatedText', () => {
  it('renders the text', () => {
    render(<TruncatedText>Acme Corporation</TruncatedText>);
    expect(screen.getByText('Acme Corporation')).toBeVisible();
  });

  it('does not attach a tooltip when the text fits', async () => {
    // happy-dom default: scrollWidth === clientWidth === 0 → not truncated.
    const user = userEvent.setup();
    render(<TruncatedText>Short</TruncatedText>);
    await user.hover(screen.getByText('Short'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('reveals the full text in a tooltip when truncated', async () => {
    simulateOverflow({ scrollWidth: 240, clientWidth: 100 });
    const full = 'A very long customer name that does not fit in its column';
    render(<TruncatedText defaultOpen>{full}</TruncatedText>);
    // Once open, the full text appears in both the trigger and the popup.
    await waitFor(() => expect(screen.getAllByText(full)).toHaveLength(2));
  });

  it('uses a single-line ellipsis by default', () => {
    render(<TruncatedText data-testid="single">Label</TruncatedText>);
    const el = screen.getByText('Label');
    expect(el).toHaveClass('truncate');
    expect(el).not.toHaveClass('overflow-hidden');
  });

  it('switches to a multi-line clamp when `lines > 1`', () => {
    render(
      <TruncatedText lines={3}>
        Some multi-line content that should clamp
      </TruncatedText>
    );
    const el = screen.getByText('Some multi-line content that should clamp');
    // happy-dom rejects the `-webkit-box` model, so assert the stable contract:
    // the clamp branch drops `truncate` for `overflow-hidden`.
    expect(el).toHaveClass('overflow-hidden');
    expect(el).not.toHaveClass('truncate');
    expect(el.style.overflow).toBe('hidden');
  });

  it('merges an extra className onto the span', () => {
    render(<TruncatedText className="extra-class">Label</TruncatedText>);
    expect(screen.getByText('Label')).toHaveClass('extra-class', 'truncate');
  });

  it('forwards the ref to the underlying span', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<TruncatedText ref={ref}>Ref target</TruncatedText>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveTextContent('Ref target');
  });

  // `mode: 'middle'`'s own truncation algorithm and real-measurement behavior
  // are `truncate-text.browser.test.tsx`'s to cover — happy-dom's lack of
  // layout means `clientWidth` is always 0 here, so this only asserts the
  // branch is wired: given room to fit, the text renders unchanged, same as
  // the `'end'` default above.
  it('renders unchanged when it fits in `mode: "middle"`', () => {
    render(<TruncatedText mode="middle">Acme Corporation</TruncatedText>);
    expect(screen.getByText('Acme Corporation')).toBeVisible();
  });
});
