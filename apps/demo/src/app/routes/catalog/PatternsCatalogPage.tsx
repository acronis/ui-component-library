import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  Stack,
  Tag,
} from '@spec-lab/ui-react';
import { specIndex, statusVariant } from './spec-index';

export function PatternsCatalogPage() {
  return (
    <Stack gap="xl">
      <PageHeader>
        <PageHeaderTitle>Patterns</PageHeaderTitle>
        <PageHeaderDescription>
          Approved multi-component compositions — {specIndex.patterns.length} in
          the spec index. Metadata only; the live implementations land in a later
          phase.
        </PageHeaderDescription>
      </PageHeader>

      <Grid cols={2} gap="lg" container>
        {specIndex.patterns.map((pattern) => (
          <Card key={pattern.name} className="flex h-full flex-col">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle>{pattern.pattern}</CardTitle>
                <Tag variant={statusVariant(pattern.status)} size="sm">
                  {pattern.status}
                </Tag>
              </div>
              {pattern.intent ? (
                <CardDescription>{pattern.intent}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="mt-auto">
              <Stack gap="md">
                {pattern.components && pattern.components.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pattern.components.map((component) => (
                      <Tag key={component} variant="neutral" size="sm">
                        {component}
                      </Tag>
                    ))}
                  </div>
                ) : null}
                {pattern.implementedBy ? (
                  <Tag variant="success">{`Graduated → ${pattern.implementedBy}`}</Tag>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}
