// Figma Code Connect — status: COMPLETE
// Mapped to the "Table" design in the ui-react Figma file. Table is a
// compositional primitive set (no variant/size props), so there are no property
// mappings — the example shows a representative composed table.
import figma from '@figma/code-connect';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

figma.connect(
  Table,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4567-6801',
  {
    example: () => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Smith</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  }
);
