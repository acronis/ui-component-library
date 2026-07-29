import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
  Stack,
  Toaster,
} from '@constructor-lab/ui-react';
import { ArrowLeftIcon } from '@constructor-lab/icons-react/stroke-mono';
import { DemoWithCode } from '@/components/DemoWithCode';
import { findDemoGroup } from './example-registry';
import { ExampleErrorBoundary } from './ExampleErrorBoundary';

// Detail page for one demo group: auto-renders every example file the registry
// discovered, each in a DemoWithCode card (live preview + collapsible source).
// A single Toaster is mounted so toast-based demos (sonner) actually fire.
export function ExampleDetailPage() {
  const { name = '' } = useParams();
  const group = findDemoGroup(name);

  if (!group) {
    return (
      <Stack gap="xl">
        <PageHeader>
          <PageHeaderTitle>Unknown example</PageHeaderTitle>
          <PageHeaderDescription>
            No demo group is registered under “{name}”.
          </PageHeaderDescription>
          <PageHeaderActions>
            <Button variant="secondary" render={<Link to="../examples" />}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Examples
            </Button>
          </PageHeaderActions>
        </PageHeader>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <PageHeader>
        <PageHeaderTitle>{group.label}</PageHeaderTitle>
        <PageHeaderDescription>
          {group.examples.length} usage{' '}
          {group.examples.length === 1 ? 'example' : 'examples'} from the shared
          demos workspace.
        </PageHeaderDescription>
        <PageHeaderActions>
          <Button variant="secondary" render={<Link to="../examples" />}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Examples
          </Button>
        </PageHeaderActions>
      </PageHeader>

      <div className="space-y-8">
        {group.examples.map((example) => (
          <DemoWithCode
            key={example.id}
            title={example.title}
            code={example.code}
          >
            <ExampleErrorBoundary name={example.id}>
              <div className="space-y-6">
                {example.components.map((Component, index) => (
                  <Component key={index} />
                ))}
              </div>
            </ExampleErrorBoundary>
          </DemoWithCode>
        ))}
      </div>

      <Toaster />
    </Stack>
  );
}
