import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { Chip } from '../../chip';
import {
  Alert,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '../alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'info',
        'success',
        'warning',
        'critical',
        'destructive',
        'ai',
        'neutral',
      ],
      description:
        'Status severity — sets the strong border, the left accent bar, and the default full-color icon.',
      table: {
        type: {
          summary:
            "'info' | 'success' | 'warning' | 'critical' | 'destructive' | 'ai' | 'neutral'",
        },
        defaultValue: { summary: 'info' },
        category: 'Appearance',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// The icon is variant-driven — an empty `<AlertIcon />` renders the variant's
// default full-color status glyph. Pass children to override it.
export const Default: Story = {
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args} className="w-[400px]">
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

// An action under the description — AlertActions sits inside AlertContent.
export const ActionBelow: Story = {
  render: () => (
    <Alert className="w-[420px]">
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Protect non-compliant devices</AlertTitle>
        <AlertDescription>
          For all registered devices, ensure that a protection plan is applied
          and a scan has completed within the last 24 hours.
        </AlertDescription>
        <AlertActions className="mt-2">
          <Button>View devices</Button>
          <Button variant="ghost">Dismiss</Button>
        </AlertActions>
      </AlertContent>
    </Alert>
  ),
};

// Additional content — status chips below the description (the design's
// `additionalContent`).
export const AdditionalContent: Story = {
  render: () => (
    <Alert variant="critical" className="w-[480px]">
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Backup failed</AlertTitle>
        <AlertDescription>
          The last backup did not complete. Likely root causes:
        </AlertDescription>
        <AlertActions className="mt-2 flex-wrap">
          <Chip variant="operational">Incorrect system configuration</Chip>
          <Chip variant="operational">Insufficient storage</Chip>
          <Chip variant="operational">Network timeout</Chip>
        </AlertActions>
      </AlertContent>
    </Alert>
  ),
};

// Dismissible — the optional compact close (×) button sits at the top-right (the
// design's `Dismissable`).
export const Dismissible: Story = {
  render: () => (
    <Alert className="w-[560px]">
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Scan completed</AlertTitle>
        <AlertDescription>
          All registered devices were scanned successfully.
        </AlertDescription>
      </AlertContent>
      <AlertClose />
    </Alert>
  ),
};

const VARIANTS = [
  { variant: 'info', title: 'Information' },
  { variant: 'success', title: 'Success' },
  { variant: 'warning', title: 'Warning' },
  { variant: 'critical', title: 'Critical' },
  { variant: 'destructive', title: 'Error' },
  { variant: 'ai', title: 'AI' },
  { variant: 'neutral', title: 'Neutral' },
] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[400px] flex-col gap-3">
      {VARIANTS.map(({ variant, title }) => (
        <Alert key={variant} variant={variant}>
          <AlertIcon />
          <AlertContent>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>The {variant} status banner.</AlertDescription>
          </AlertContent>
        </Alert>
      ))}
    </div>
  ),
};
