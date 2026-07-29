import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  Stack,
  Tag,
} from '@constructor-lab/ui-react';
import { demoGroups, totalExampleCount } from './example-registry';

// Index of the auto-imported examples gallery: one card per demo group, linking
// to the group's detail page. Everything here is derived from the glob-built
// registry, so new demos in apps/demos appear automatically.
export function ExamplesCatalogPage() {
  return (
    <Stack gap="xl">
      <PageHeader>
        <PageHeaderTitle>Examples</PageHeaderTitle>
        <PageHeaderDescription>
          Every usage example from the shared demos workspace —{' '}
          {totalExampleCount} demos across {demoGroups.length} components,
          imported automatically. These are the "how you'd use it in a real app"
          references.
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoGroups.map((group) => (
          <Card key={group.slug} render={<Link to={group.slug} />}>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle>{group.label}</CardTitle>
              <Tag variant="neutral" size="sm">
                {group.examples.length}
              </Tag>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {group.examples.length === 1
                ? '1 example'
                : `${group.examples.length} examples`}
            </CardContent>
          </Card>
        ))}
      </div>
    </Stack>
  );
}
