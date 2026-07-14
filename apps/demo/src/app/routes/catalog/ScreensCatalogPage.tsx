import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
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
} from '@constructor-lab/ui-react';
import { specIndex, statusVariant } from './spec-index';

// The console itself is the app-shell realization of the protection-dashboard
// screen, so its live view is the console's Overview (the /dashboard route).
// Relative Link, consistent with the sidebar's nav wiring.
const LIVE_ROUTES: Record<string, string> = {
  'protection-dashboard': '../../dashboard',
};

export function ScreensCatalogPage() {
  return (
    <Stack gap="xl">
      <PageHeader>
        <PageHeaderTitle>Screens</PageHeaderTitle>
        <PageHeaderDescription>
          Full product screens assembled from the kit —{' '}
          {specIndex.screens.length} in the spec index. Live rendering arrives
          in a later phase.
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
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    {LIVE_ROUTES[screen.name] ? (
                      <Button
                        variant="ghost"
                        render={<Link to={LIVE_ROUTES[screen.name]} />}
                      >
                        View live
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
