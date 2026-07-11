import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Grid,
  PageHeader,
  PageHeaderDescription,
  PageHeaderRow,
  PageHeaderTitle,
} from '@spec-lab/ui-react';

const integrations = [
  { id: 'i1', name: 'Slack', summary: 'Send alerts to your team channels.' },
  {
    id: 'i2',
    name: 'Jira',
    summary: 'Open tickets from incidents automatically.',
  },
  { id: 'i3', name: 'PagerDuty', summary: 'Escalate critical alerts on-call.' },
  {
    id: 'i4',
    name: 'GitHub',
    summary: 'Link deployments to protected workloads.',
  },
  {
    id: 'i5',
    name: 'Datadog',
    summary: 'Forward backup metrics to dashboards.',
  },
  { id: 'i6', name: 'Okta', summary: 'Provision users with single sign-on.' },
];

export function CardGridDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Integrations</PageHeaderTitle>
        </PageHeaderRow>
        <PageHeaderDescription>
          Connect the tools your team already uses.
        </PageHeaderDescription>
      </PageHeader>
      <Grid cols={3} gap="md">
        {integrations.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.summary}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary">Connect</Button>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
