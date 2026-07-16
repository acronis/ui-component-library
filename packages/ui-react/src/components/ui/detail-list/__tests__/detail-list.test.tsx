import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DetailList, type DetailListItem } from '../detail-list';

const ITEMS: DetailListItem[] = [
  { label: 'Status', value: 'Active' },
  { label: 'Owner', value: 'Ada Lovelace', description: 'ada@example.com' },
  { label: 'Region', value: 'EU (Frankfurt)' },
];

describe('DetailList', () => {
  it('renders a term/definition pair per item', () => {
    render(<DetailList items={ITEMS} />);
    expect(screen.getByText('Status')).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('Owner')).toBeVisible();
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
  });

  it('renders as a <dl> of <dt>/<dd> rows', () => {
    const { container } = render(<DetailList items={ITEMS} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(ITEMS.length);
    expect(container.querySelectorAll('dd')).toHaveLength(ITEMS.length);
  });

  it('renders the muted description under the value', () => {
    render(<DetailList items={ITEMS} />);
    expect(screen.getByText('ada@example.com')).toBeVisible();
  });

  it('renders a leading icon and inline actions', () => {
    render(
      <DetailList
        items={[
          {
            label: 'Status',
            value: 'Degraded',
            icon: <svg data-testid="status-icon" />,
            actions: <a href="#logs">View logs</a>,
          },
        ]}
      />
    );
    expect(screen.getByTestId('status-icon')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View logs' })).toBeVisible();
  });

  it('applies the two-column grid layout', () => {
    const { container } = render(<DetailList items={ITEMS} columns={2} />);
    const dl = container.querySelector('dl');
    expect(dl?.className).toContain('sm:grid-cols-2');
  });

  it('sets the label-column width from labelWidth', () => {
    const { container } = render(
      <DetailList items={ITEMS} labelWidth="10rem" />
    );
    const dl = container.querySelector('dl') as HTMLElement;
    expect(dl.style.getPropertyValue('--description-list-label')).toBe('10rem');
  });
});
