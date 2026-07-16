'use client';

import {
  Button,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardGrid,
  Tag,
} from '@constructor-lab/ui-react';

type Integration = {
  id: string;
  name: string;
  summary: string;
  status: 'Connected' | 'Available';
};

const ITEMS: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    summary: 'Send alerts to channels.',
    status: 'Connected',
  },
  {
    id: 'github',
    name: 'GitHub',
    summary: 'Sync issues and PRs.',
    status: 'Connected',
  },
  {
    id: 'jira',
    name: 'Jira',
    summary: 'Create tickets from findings.',
    status: 'Available',
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    summary: 'Page on-call for incidents.',
    status: 'Available',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    summary: 'Stream metrics and logs.',
    status: 'Available',
  },
  {
    id: 'okta',
    name: 'Okta',
    summary: 'Provision users via SCIM.',
    status: 'Connected',
  },
];

export function CardGridDemo() {
  return (
    <CardGrid
      items={ITEMS}
      getKey={(i: Integration) => i.id}
      renderItem={(i: Integration) => (
        <>
          <CardHeader>
            <CardTitle>{i.name}</CardTitle>
            <CardDescription>{i.summary}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Tag>{i.status}</Tag>
            <Button variant="secondary">
              {i.status === 'Connected' ? 'Configure' : 'Connect'}
            </Button>
          </CardFooter>
        </>
      )}
    />
  );
}
