import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import {
  groupBy,
  layerLabel,
  specIndex,
  statusVariant,
  type SpecComponent,
} from './spec-index';

// Primitives before Composites; anything else falls to the end.
const LAYER_ORDER = ['primitive', 'composite'];

function layerRank(layer: string): number {
  const i = LAYER_ORDER.indexOf(layer);
  return i === -1 ? LAYER_ORDER.length : i;
}

function ComponentTable({ items }: { items: SpecComponent[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Layer</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((component) => (
          <TableRow key={component.name}>
            <TableCell className="font-medium">{component.component}</TableCell>
            <TableCell className="text-muted-foreground">
              {component.category}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {layerLabel(component.layer)}
            </TableCell>
            <TableCell>
              <Tag variant={statusVariant(component.status)} size="sm">
                {component.status}
              </Tag>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ComponentsCatalogPage() {
  const byLayer = [...groupBy(specIndex.components, (c) => c.layer ?? 'other')].sort(
    ([a], [b]) => layerRank(a) - layerRank(b)
  );

  return (
    <Stack gap="xl">
      <PageHeader>
        <PageHeaderTitle>Components</PageHeaderTitle>
        <PageHeaderDescription>
          Every component with a spec, grouped by layer then category — driven by
          the {specIndex.components.length}-entry spec index.
        </PageHeaderDescription>
      </PageHeader>

      {byLayer.map(([layer, layerComponents]) => (
        <Stack key={layer} gap="md">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {layerLabel(layer)}
            </h2>
            <Tag variant="neutral" size="sm">
              {layerComponents.length}
            </Tag>
          </div>

          <Stack gap="md">
            {groupBy(layerComponents, (c) => c.category).map(
              ([category, categoryComponents]) => (
                <Card key={category}>
                  <CardHeader className="flex-row items-center gap-2">
                    <CardTitle className="capitalize">{category}</CardTitle>
                    <Tag variant="neutral" size="sm">
                      {categoryComponents.length}
                    </Tag>
                  </CardHeader>
                  <CardContent>
                    <ComponentTable items={categoryComponents} />
                  </CardContent>
                </Card>
              )
            )}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
