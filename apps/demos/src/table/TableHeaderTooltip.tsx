import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@constructor-lab/ui-react';
import { CircleHelpIcon } from '@constructor-lab/icons-react/stroke-mono';

// "Default table / Table header / Tooltip → Hover" from the Figma "Basic table
// behavior" section: a column header can carry a tooltip that explains the
// column (or reveals a label truncated by a narrow column) on hover / focus.
// Table stays presentational — the tooltip is consumer composition inside the
// header cell.

const rows = [
  { name: 'web-server-01', rpo: '15 min', retention: '30 days' },
  { name: 'db-primary', rpo: '5 min', retention: '90 days' },
  { name: 'cache-node-3', rpo: '1 hour', retention: '7 days' },
];

function HeaderWithTooltip({ label, hint }: { label: string; hint: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                aria-label={`About ${label}`}
                className="inline-flex rounded-sm text-[var(--ui-table-header-sort-icon-color-inactive)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]"
              />
            }
          >
            <CircleHelpIcon className="h-3.5 w-3.5" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-[220px]">{hint}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}

export function TableHeaderTooltip() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>
              <HeaderWithTooltip
                label="RPO"
                hint="Recovery Point Objective — the maximum acceptable amount of data loss measured in time."
              />
            </TableHead>
            <TableHead>
              <HeaderWithTooltip
                label="Retention"
                hint="How long recovery points are kept before they are pruned."
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.rpo}</TableCell>
              <TableCell>{row.retention}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
