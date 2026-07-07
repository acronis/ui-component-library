import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
  Stack,
  Tag,
} from '@spec-lab/ui-react';
import { ArrowLeftIcon } from '@spec-lab/icons-react/stroke-mono';
import { layerLabel, specIndex, statusVariant } from './spec-index';
import { componentDemos } from './component-demos';

// A spec-driven component detail page: it looks the component up in the
// spec-index (the source of truth for what exists), renders its metadata
// (layer / category / status), and mounts its existing live demo reused as-is
// from the merged component-library browser. Components without a demo show a
// subtle "No demo yet" placeholder beside their metadata.
export function ComponentDetailPage() {
  const { name = '' } = useParams();
  const component = specIndex.components.find((c) => c.name === name);
  const Demo = componentDemos[name];

  if (!component) {
    return (
      <Stack gap="xl">
        <PageHeader>
          <PageHeaderTitle>Unknown component</PageHeaderTitle>
          <PageHeaderDescription>
            No spec component is registered under “{name}”.
          </PageHeaderDescription>
          <PageHeaderActions>
            <Button variant="secondary" render={<Link to="../components" />}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Components
            </Button>
          </PageHeaderActions>
        </PageHeader>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <PageHeader>
        <PageHeaderTitle>{component.component}</PageHeaderTitle>
        <PageHeaderDescription>
          The <code>{component.name}</code> spec, with its live demo below.
        </PageHeaderDescription>
        <PageHeaderActions>
          <Button variant="secondary" render={<Link to="../components" />}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Components
          </Button>
        </PageHeaderActions>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <Tag variant="neutral" size="sm">
          {layerLabel(component.layer)}
        </Tag>
        <Tag variant="neutral" size="sm">
          {component.category}
        </Tag>
        <Tag variant={statusVariant(component.status)} size="sm">
          {component.status}
        </Tag>
        {component.since ? (
          <span className="text-muted-foreground text-sm">
            since {component.since}
          </span>
        ) : null}
      </div>

      {Demo ? (
        <Demo />
      ) : (
        <Card>
          <CardContent className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No demo yet</EmptyTitle>
                <EmptyDescription>
                  {component.component} has a spec but no live demo in the
                  console. Its metadata is shown above.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
