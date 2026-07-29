import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Timeline, TimelineItem, TimelineMarker } from '../timeline';
import { Avatar, AvatarFallback } from '../../avatar';
import { Tag } from '../../tag';

describe('Timeline', () => {
  it('renders a semantic ordered list of list items', () => {
    render(
      <Timeline>
        <TimelineItem title="Ticket created" />
        <TimelineItem title="Ticket assigned" />
      </Timeline>
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('preserves the caller order (never sorts)', () => {
    render(
      <Timeline>
        <TimelineItem title="Third" />
        <TimelineItem title="First" />
        <TimelineItem title="Second" />
      </Timeline>
    );
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      ['Third', 'First', 'Second']
    );
  });

  it('forwards a ref to the list element', () => {
    const ref = React.createRef<HTMLOListElement>();
    render(<Timeline ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLOListElement);
  });

  it('merges a caller className onto the list', () => {
    const { container } = render(<Timeline className="mt-6" />);
    expect(container.firstElementChild).toHaveClass('mt-6');
  });
});

describe('TimelineItem', () => {
  it('renders title, timestamp, tag and content', () => {
    render(
      <Timeline>
        <TimelineItem
          title="Mike Chen"
          timestamp="Dec 22, 08:30 AM"
          tag={<Tag variant="warning">Internal note</Tag>}
        >
          Escalated to tier 2.
        </TimelineItem>
      </Timeline>
    );
    expect(screen.getByText('Mike Chen')).toBeInTheDocument();
    expect(screen.getByText('Dec 22, 08:30 AM')).toBeInTheDocument();
    expect(screen.getByText('Internal note')).toBeInTheDocument();
    expect(screen.getByText('Escalated to tier 2.')).toBeInTheDocument();
  });

  it('renders a footer-actions row only when actions are given', () => {
    const { rerender } = render(
      <Timeline>
        <TimelineItem title="Error">
          <a href="#support">Get support</a>
        </TimelineItem>
      </Timeline>
    );
    expect(screen.queryByRole('link', { name: 'All properties' })).toBeNull();

    rerender(
      <Timeline>
        <TimelineItem
          title="Error"
          actions={<a href="#props">All properties</a>}
        >
          body
        </TimelineItem>
      </Timeline>
    );
    expect(
      screen.getByRole('link', { name: 'All properties' })
    ).toBeInTheDocument();
  });

  it('renders the built-in marker with a dot when no icon or marker is given', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Ticket created" />
      </Timeline>
    );
    const marker = container.querySelector('[data-slot="timeline-marker"]');
    expect(marker).toBeInTheDocument();
    expect(marker).toHaveAttribute('aria-hidden');
    expect(marker?.firstElementChild?.className).toContain('bg-current');
  });

  it('renders an icon inside the built-in marker', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Alert linked" icon={<svg data-testid="mark" />} />
      </Timeline>
    );
    const marker = container.querySelector('[data-slot="timeline-marker"]');
    expect(marker?.querySelector('[data-testid="mark"]')).toBeInTheDocument();
  });

  // The design's marker is an Avatar instance, so the slot must win outright.
  it('replaces the built-in marker with the marker slot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem
          title="Sarah Johnson"
          marker={
            <Avatar color="green">
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
          }
          icon={<svg data-testid="ignored" />}
        />
      </Timeline>
    );
    expect(
      container.querySelector('[data-slot="timeline-marker"]')
    ).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="ignored"]')).toBeNull();
    expect(screen.getByText('SJ')).toBeInTheDocument();
  });

  // `status` tints the marker only — it must never fill the content card.
  it.each([
    'neutral',
    'info',
    'success',
    'warning',
    'danger',
    'critical',
  ] as const)('tints the marker for status=%s', (status) => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event" status={status} />
      </Timeline>
    );
    const marker = container.querySelector('[data-slot="timeline-marker"]');
    expect(marker?.className).toContain(
      `bg-[var(--ui-background-status-${status}-pressed)]`
    );
    expect(marker?.className).toContain(
      `text-[var(--ui-text-on-status-${status})]`
    );
    expect(screen.getByRole('listitem')).toHaveAttribute('data-status', status);
  });

  it('renders a connector that the last item hides', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="One" />
        <TimelineItem title="Two" />
      </Timeline>
    );
    const connectors = container.querySelectorAll(
      '[data-slot="timeline-connector"]'
    );
    expect(connectors).toHaveLength(2);
    // The rail is drawn on every item; the last one is hidden in CSS, because
    // "last" is only knowable at render time in the DOM, not per-item.
    for (const connector of connectors) {
      expect(connector.className).toContain('group-last/timeline-item:hidden');
      expect(connector).toHaveAttribute('aria-hidden');
    }
  });

  // The rail sits under the marker's centre, so it must use a logical inset or
  // it stays on the left when the marker moves right under RTL.
  it('positions the connector with a logical inset', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="One" />
      </Timeline>
    );
    const connector = container.querySelector(
      '[data-slot="timeline-connector"]'
    );
    expect(connector?.className).toContain('start-4');
    expect(connector?.className).not.toMatch(/\bleft-/);
  });

  it('renders arbitrary children, including a nested Timeline', () => {
    render(
      <Timeline>
        <TimelineItem title="Backup run">
          <p>Completed with warnings.</p>
          <Timeline>
            <TimelineItem title="Warning" />
          </Timeline>
        </TimelineItem>
      </Timeline>
    );
    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getByText('Completed with warnings.')).toBeInTheDocument();
  });

  it('omits the header entirely when there is no title, tag or timestamp', () => {
    render(
      <Timeline>
        <TimelineItem>Just a body line.</TimelineItem>
      </Timeline>
    );
    expect(screen.getByText('Just a body line.')).toBeInTheDocument();
  });

  it('forwards a ref to the list item', () => {
    const ref = React.createRef<HTMLLIElement>();
    render(
      <Timeline>
        <TimelineItem ref={ref} title="One" />
      </Timeline>
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });

  it('merges a caller className onto the item', () => {
    render(
      <Timeline>
        <TimelineItem title="One" className="opacity-60" />
      </Timeline>
    );
    expect(screen.getByRole('listitem')).toHaveClass('opacity-60');
  });
});

describe('TimelineMarker', () => {
  it('is decorative and defaults to the neutral status', () => {
    const { container } = render(<TimelineMarker />);
    const marker = container.firstElementChild as HTMLElement;
    expect(marker).toHaveAttribute('aria-hidden');
    expect(marker).toHaveAttribute('data-status', 'neutral');
  });

  it('forwards a ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<TimelineMarker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
