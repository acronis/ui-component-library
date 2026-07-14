import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutTableIcon } from '@constructor-lab/icons-react/stroke-mono';

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

const meta = {
  title: 'UI/WidgetTableData',
  component: WidgetTableData,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetTableData>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { device: 'Workstation-01', status: 'Protected' },
  { device: 'Workstation-02', status: 'Protected' },
  { device: 'Server-DB-01', status: 'At risk' },
];

export const Default: Story = {
  render: () => (
    <WidgetTableData className="w-[420px]">
      <WidgetTableDataHeader>
        <WidgetTableDataIcon>
          <LayoutTableIcon />
        </WidgetTableDataIcon>
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
            {rows.map((row) => (
              <WidgetTableDataTr key={row.device}>
                <WidgetTableDataTd>{row.device}</WidgetTableDataTd>
                <WidgetTableDataTd>{row.status}</WidgetTableDataTd>
              </WidgetTableDataTr>
            ))}
          </WidgetTableDataTbody>
        </WidgetTableDataTable>
      </WidgetTableDataContent>
      <WidgetTableDataFooter>
        <span>Showing 3 of 12</span>
        <WidgetTableDataLink href="#">View all</WidgetTableDataLink>
      </WidgetTableDataFooter>
    </WidgetTableData>
  ),
};

export const Compact: Story = {
  render: () => (
    <WidgetTableData className="w-[360px]">
      <WidgetTableDataContent>
        <WidgetTableDataTable>
          <WidgetTableDataTbody>
            {rows.map((row) => (
              <WidgetTableDataTr key={row.device}>
                <WidgetTableDataTd>{row.device}</WidgetTableDataTd>
                <WidgetTableDataTd>{row.status}</WidgetTableDataTd>
              </WidgetTableDataTr>
            ))}
          </WidgetTableDataTbody>
        </WidgetTableDataTable>
      </WidgetTableDataContent>
    </WidgetTableData>
  ),
};

export const Interactive: Story = {
  render: () => (
    <WidgetTableData interactive className="w-[420px]">
      <WidgetTableDataHeader>
        <WidgetTableDataIcon>
          <LayoutTableIcon />
        </WidgetTableDataIcon>
        <WidgetTableDataTitle>Click to open</WidgetTableDataTitle>
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
            {rows.map((row) => (
              <WidgetTableDataTr key={row.device}>
                <WidgetTableDataTd>{row.device}</WidgetTableDataTd>
                <WidgetTableDataTd>{row.status}</WidgetTableDataTd>
              </WidgetTableDataTr>
            ))}
          </WidgetTableDataTbody>
        </WidgetTableDataTable>
      </WidgetTableDataContent>
    </WidgetTableData>
  ),
};
