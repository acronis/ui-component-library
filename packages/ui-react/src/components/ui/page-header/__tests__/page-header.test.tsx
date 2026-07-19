import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderBreadcrumb,
  PageHeaderDescription,
  PageHeaderRow,
  PageHeaderTitle,
} from '../index';

describe('PageHeader', () => {
  it('renders the header block with title, description, breadcrumb and actions', () => {
    const { container } = render(
      <PageHeader>
        <PageHeaderBreadcrumb>Home / Reports</PageHeaderBreadcrumb>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
          <PageHeaderActions>
            <button>New</button>
          </PageHeaderActions>
        </PageHeaderRow>
        <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
      </PageHeader>
    );
    // PageHeader is a non-landmark block (no role="banner") — the app header is
    // the page's sole banner; assert the block by its data-slot.
    expect(
      container.querySelector('[data-slot="page-header"]')
    ).toBeInTheDocument();
    expect(screen.getByText('Reports').tagName).toBe('H1');
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByText('All scheduled reports.')).toHaveClass(
      'text-muted-foreground'
    );
  });
});
