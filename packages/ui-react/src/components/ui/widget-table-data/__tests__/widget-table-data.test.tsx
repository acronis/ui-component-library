import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetTableData,
  WidgetTableDataContent,
  WidgetTableDataFooter,
  WidgetTableDataHeader,
  WidgetTableDataIcon,
  WidgetTableDataLink,
  WidgetTableDataTable,
  WidgetTableDataTbody,
  WidgetTableDataTd,
  WidgetTableDataTh,
  WidgetTableDataThead,
  WidgetTableDataTitle,
  WidgetTableDataTr,
} from '../widget-table-data';

describe('WidgetTableData', () => {
  it('renders a composed table widget', () => {
    render(
      <WidgetTableData>
        <WidgetTableDataHeader>
          <WidgetTableDataTitle>Recent backups</WidgetTableDataTitle>
        </WidgetTableDataHeader>
        <WidgetTableDataContent>
          <WidgetTableDataTable>
            <WidgetTableDataThead>
              <WidgetTableDataTr>
                <WidgetTableDataTh>Device</WidgetTableDataTh>
                <WidgetTableDataTh>Status</WidgetTableDataTh>
              </WidgetTableDataTr>
            </WidgetTableDataThead>
            <WidgetTableDataTbody>
              <WidgetTableDataTr>
                <WidgetTableDataTd>Workstation-01</WidgetTableDataTd>
                <WidgetTableDataTd>
                  <WidgetTableDataLink href="#">Details</WidgetTableDataLink>
                </WidgetTableDataTd>
              </WidgetTableDataTr>
            </WidgetTableDataTbody>
          </WidgetTableDataTable>
        </WidgetTableDataContent>
        <WidgetTableDataFooter>Showing 1 of 12</WidgetTableDataFooter>
      </WidgetTableData>
    );

    expect(screen.getByText('Recent backups')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Device' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Workstation-01' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      '#'
    );
    expect(screen.getByText('Showing 1 of 12')).toBeInTheDocument();
  });

  it('is not focusable by default', () => {
    render(<WidgetTableData data-testid="wtd">content</WidgetTableData>);
    expect(screen.getByTestId('wtd')).not.toHaveAttribute('tabindex');
  });

  it('becomes focusable and interactive when interactive', () => {
    render(
      <WidgetTableData data-testid="wtd" interactive>
        content
      </WidgetTableData>
    );
    const widget = screen.getByTestId('wtd');
    expect(widget).toHaveAttribute('tabindex', '0');
    expect(widget).toHaveClass('cursor-pointer');
  });

  it('does not leak the interactive prop to the DOM', () => {
    render(
      <WidgetTableData data-testid="wtd" interactive>
        content
      </WidgetTableData>
    );
    expect(screen.getByTestId('wtd')).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WidgetTableData ref={ref}>content</WidgetTableData>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders the icon slot with the size-4 svg utility', () => {
    render(
      <WidgetTableDataIcon data-testid="icon">
        <svg data-testid="icon-svg" />
      </WidgetTableDataIcon>
    );
    expect(screen.getByTestId('icon')).toHaveClass('text-secondary');
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('merges a custom className on parts', () => {
    render(
      <WidgetTableDataTitle className="custom-x">Title</WidgetTableDataTitle>
    );
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});
