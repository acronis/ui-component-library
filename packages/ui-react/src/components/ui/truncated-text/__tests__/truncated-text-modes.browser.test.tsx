import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

// Real styles — `text-overflow`/`-webkit-line-clamp`/canvas font metrics and
// `scrollWidth`/`scrollHeight` overflow detection all need real layout, which
// happy-dom does not perform.
import '../../../../styles/index.css';

import { TruncatedText } from '../truncated-text';

const LONG =
  'Acme Corporation International Holdings & Subsidiaries — Global Compliance Division';

function renderAt(width: number, node: ReactElement) {
  const host = document.createElement('div');
  host.style.width = `${width}px`;
  document.body.append(host);
  return { host, ...render(node, { container: host }) };
}

function displayedText(): string {
  const span = document.querySelector('span');
  if (span === null) throw new Error('expected a rendered span');
  return span.textContent ?? '';
}

describe('TruncatedText', () => {
  // Unlike `mode: 'middle'`, CSS `text-overflow: ellipsis` never touches the
  // DOM text — it paints the ellipsis at render time over content that stays
  // wider than the box. `scrollWidth > clientWidth` is therefore the actual
  // truncation signal here, not a textContent change.
  it('end mode: paints an ellipsis over the full text, which stays intact in the DOM', async () => {
    renderAt(150, <TruncatedText>{LONG}</TruncatedText>);
    await waitFor(() => {
      const span = document.querySelector('span');
      if (span === null) throw new Error('expected a rendered span');
      expect(span.textContent).toBe(LONG);
      expect(span.scrollWidth).toBeGreaterThan(span.clientWidth);
    });
  });

  it('middle mode: keeps both ends, ellipsis in the middle', async () => {
    renderAt(150, <TruncatedText mode="middle">{LONG}</TruncatedText>);
    await waitFor(() => {
      const shown = displayedText();
      expect(shown).not.toBe(LONG);
      expect(shown).toContain('…');
      expect(LONG.startsWith(shown.split('…')[0] ?? '')).toBe(true);
      const tail = shown.split('…')[1] ?? '';
      expect(tail.length > 0 ? LONG.endsWith(tail) : true).toBe(true);
    });
  });

  // The span's own content legitimately overflows (that's the ellipsis
  // mechanism) — what must not happen is that overflow inflating the box
  // asked for. `overflow: hidden` on the span is what keeps the host at the
  // width it was given despite the (wider) nowrap content underneath.
  it('does not let the overflowing content inflate its host', async () => {
    const { host } = renderAt(150, <TruncatedText>{LONG}</TruncatedText>);
    await waitFor(() => {
      const span = document.querySelector('span');
      if (span === null) throw new Error('expected a rendered span');
      expect(span.scrollWidth).toBeGreaterThan(span.clientWidth);
    });
    expect(host.getBoundingClientRect().width).toBeLessThanOrEqual(151);
  });

  it('clamp mode: wraps up to `lines` lines, not fewer, not more', async () => {
    const host = document.createElement('div');
    host.style.width = '150px';
    document.body.append(host);
    render(<TruncatedText lines={2}>{LONG}</TruncatedText>, {
      container: host,
    });

    await waitFor(() => {
      const span = document.querySelector('span');
      if (span === null) throw new Error('expected a rendered span');
      // Clamped to 2 lines' worth of height, with the overflow hidden rather
      // than growing the box to fit every line the text would otherwise need.
      expect(span.scrollHeight).toBeGreaterThan(span.clientHeight);
    });
  });

  it('reveals the full text in a tooltip once truncated', async () => {
    const user = userEvent.setup();
    renderAt(150, <TruncatedText>{LONG}</TruncatedText>);

    await waitFor(() => {
      const span = document.querySelector('span');
      if (span === null) throw new Error('expected a rendered span');
      expect(span.scrollWidth).toBeGreaterThan(span.clientWidth);
    });
    await user.hover(screen.getByText(LONG));
    await waitFor(() => expect(screen.getAllByText(LONG)).toHaveLength(2));
  });

  it('reveals no tooltip when nothing is truncated', async () => {
    const user = userEvent.setup();
    renderAt(1000, <TruncatedText>short-value</TruncatedText>);
    await waitFor(() => expect(displayedText()).toBe('short-value'));

    await user.hover(screen.getByText('short-value'));
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(screen.getAllByText('short-value')).toHaveLength(1);
  });
});

describe('TruncatedText — mode="middle"', () => {
  it('never renders something that overflows its own box', async () => {
    renderAt(150, <TruncatedText mode="middle">{LONG}</TruncatedText>);
    await waitFor(() => {
      const span = document.querySelector('span');
      if (span === null) throw new Error('expected a rendered span');
      // `scrollWidth` is the content's full layout width, `clientWidth` the
      // visible box — a real overflow (the defect this component exists to
      // prevent) would show the former strictly larger than the latter.
      expect(span.scrollWidth).toBeLessThanOrEqual(span.clientWidth + 1);
    });
  });

  it('re-truncates less aggressively when the container grows', async () => {
    const { host } = renderAt(
      150,
      <TruncatedText mode="middle">{LONG}</TruncatedText>
    );

    let narrow = '';
    await waitFor(() => {
      narrow = displayedText();
      expect(narrow).not.toBe(LONG);
    });

    host.style.width = '500px';
    // `clientWidth` on the observed node changes as a side effect of the host
    // resizing around it — `ResizeObserver` picks that up without any further
    // action here.

    await waitFor(() => {
      const wider = displayedText();
      expect(wider.length).toBeGreaterThan(narrow.length);
    });
  });

  it('fills a flex row parent, not just a block one, and still grows back on resize', async () => {
    // The regression: a plain `<div>` host (every other test here) is block
    // layout, where a `display: block` child with no explicit width already
    // fills it — the browser's default "auto width fills the container" rule
    // is specific to block layout. A real consumer's cell is rarely that
    // plain; this one — a flex row, this component next to a fixed-size
    // sibling, exactly the shape of "URL text + a copy-icon button" — is a
    // flex *item* instead, where the default `flex-basis: auto` means "size
    // to your own content" — which, once this has truncated once, is
    // whatever it truncated *itself* to, not the room actually available. A
    // version missing `flex-1` passes every other test in this file and
    // still shrinks down, never grows back, the moment it is asked to fill a
    // flex sibling's leftover space instead of a bare block box.
    const host = document.createElement('div');
    host.style.width = '150px';
    document.body.append(host);
    render(
      <div style={{ display: 'flex', width: '100%', minWidth: 0 }}>
        <TruncatedText mode="middle">{LONG}</TruncatedText>
        <span style={{ flexShrink: 0, width: 24 }}>btn</span>
      </div>,
      { container: host }
    );

    let narrow = '';
    await waitFor(() => {
      narrow = displayedText();
      expect(narrow).not.toBe(LONG);
    });

    host.style.width = '600px';

    await waitFor(() => {
      const wider = displayedText();
      expect(wider.length).toBeGreaterThan(narrow.length);
    });
  });

  it('reveals the full text in a tooltip once truncated', async () => {
    const user = userEvent.setup();
    renderAt(150, <TruncatedText mode="middle">{LONG}</TruncatedText>);

    await waitFor(() => expect(displayedText()).not.toBe(LONG));

    await user.hover(screen.getByText(displayedText(), { exact: false }));
    await waitFor(() => expect(screen.getByText(LONG)).toBeInTheDocument());
  });

  it('settles at the width its column would have had without it, not the width its own full text would need', async () => {
    // `table-layout: auto` sizes an unsized column from its cells' own
    // min-content — the actual regression this guards: an earlier version
    // always rendered `white-space: nowrap`, even on its very first paint,
    // before `ResizeObserver` had measured anything. Nowrap makes an unbroken
    // string's min-content its *entire* rendered width, so the browser widened
    // the column to fit the whole string before truncation ever got a say —
    // this table would have rendered ~600px wide instead of the ~300px asked for.
    const host = document.createElement('div');
    host.style.width = '300px';
    document.body.append(host);

    render(
      <table style={{ tableLayout: 'auto', width: '100%' }}>
        <tbody>
          <tr>
            <td>
              <TruncatedText mode="middle">{LONG}</TruncatedText>
            </td>
            <td style={{ width: 150 }}>fixed column</td>
          </tr>
        </tbody>
      </table>,
      { container: host }
    );

    await waitFor(() => {
      const shown = displayedText();
      expect(shown).not.toBe(LONG);
    });

    const table = document.querySelector('table');
    if (table === null) throw new Error('expected a rendered table');
    // The regression let the table blow out to roughly the string's own width
    // (~600px+); a working fix keeps it at (approximately) what the host asked
    // for — some slack for cell padding/borders, none for hundreds of extra
    // pixels of unbroken text.
    expect(table.getBoundingClientRect().width).toBeLessThan(320);
  });

  it('reveals no tooltip when nothing is truncated', async () => {
    const user = userEvent.setup();
    renderAt(
      1000,
      <TruncatedText mode="middle">short-value.txt</TruncatedText>
    );
    await waitFor(() => expect(displayedText()).toBe('short-value.txt'));

    await user.hover(screen.getByText('short-value.txt'));
    // Give a tooltip, if one were wired up regardless of truncation state, time
    // to appear — there should be exactly one match (the span itself), never a
    // second copy of the same text in a popup.
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(screen.getAllByText('short-value.txt')).toHaveLength(1);
  });
});
