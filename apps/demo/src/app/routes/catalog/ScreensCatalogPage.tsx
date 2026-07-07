import * as React from 'react';
import {
  Card,
  CardContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@spec-lab/ui-react';
import { specIndex, statusVariant } from './spec-index';

export function ScreensCatalogPage() {
  return (
    <Stack gap="xl">
      <PageHeader>
        <PageHeaderTitle>Screens</PageHeaderTitle>
        <PageHeaderDescription>
          Full product screens assembled from the kit — {specIndex.screens.length}{' '}
          in the spec index. Live rendering arrives in a later phase.
        </PageHeaderDescription>
      </PageHeader>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Screen</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Pattern</TableHead>
                <TableHead>Story</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specIndex.screens.map((screen) => (
                <TableRow key={screen.name}>
                  <TableCell className="font-medium">{screen.title}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {screen.route ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {screen.pattern ?? '—'}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {screen.story ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Tag variant={statusVariant(screen.status)} size="sm">
                      {screen.status}
                    </Tag>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
