import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { Link } from '../../link';
import {
  Tour,
  TourActions,
  TourBackButton,
  TourBeacon,
  TourBody,
  TourClose,
  TourContent,
  TourDescription,
  TourFooter,
  TourHeader,
  TourNextButton,
  TourScrim,
  TourSkipButton,
  TourStepCounter,
  TourTitle,
  TourTrigger,
} from '../tour';

const meta = {
  title: 'UI/Tour',
  component: Tour,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    stepCount: {
      control: { type: 'number', min: 1 },
      description: 'Total number of steps — drives the counter and last-step logic.',
      table: { type: { summary: 'number' }, category: 'State' },
    },
    activeStep: {
      control: { type: 'number', min: 0 },
      description: 'Controlled active step index (0-based). Pair with `onActiveStepChange`.',
      table: { type: { summary: 'number' }, category: 'State' },
    },
    defaultActiveStep: {
      control: { type: 'number', min: 0 },
      description: 'Uncontrolled initial active step index (0-based).',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state of the coach-mark. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Open on mount, uncontrolled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    onActiveStepChange: {
      control: false,
      description: 'Fires with the next 0-based index when the active step changes.',
      table: { type: { summary: '(step: number) => void' }, category: 'Events' },
    },
    onOpenChange: {
      control: false,
      description: 'Fires with the next open state when the coach-mark opens or closes.',
      table: { type: { summary: '(open: boolean) => void' }, category: 'Events' },
    },
    onComplete: {
      control: false,
      description: 'Fires when the user advances past the last step.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    onSkip: {
      control: false,
      description: 'Fires when the user skips or dismisses the tour.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    children: {
      control: false,
      description:
        'The coach-mark parts — a `TourTrigger`/anchor plus a `TourContent` composing header, body, footer, counter, and Next / Back / Skip actions.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A stepped coach-mark: title, body, a "2 of 5" counter, and Back / Skip / Next. */
export const Default: Story = {
  args: { stepCount: 5, defaultActiveStep: 1, defaultOpen: true },
  render: (args) => (
    <Tour {...args}>
      <span className="relative inline-flex">
        <TourBeacon className="absolute -left-1 -top-1" />
        <TourTrigger render={<Button variant="secondary">Protection</Button>} />
      </span>
      <TourContent side="right" align="center">
        <TourClose />
        <TourHeader>
          <TourTitle>Protection management</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>
            Manage backups, security, and recovery for every workload from this
            section.
          </TourDescription>
        </TourBody>
        <TourFooter>
          <TourStepCounter />
          <TourActions>
            <TourSkipButton />
            <TourBackButton />
            <TourNextButton />
          </TourActions>
        </TourFooter>
      </TourContent>
    </Tour>
  ),
};

/** First step — Back is disabled and Skip is offered. */
export const FirstStep: Story = {
  args: { stepCount: 5, defaultActiveStep: 0, defaultOpen: true },
  render: Default.render,
};

/** Last step — Next reads "Done" and completes the tour. */
export const LastStep: Story = {
  args: { stepCount: 5, defaultActiveStep: 4, defaultOpen: true },
  render: Default.render,
};

/**
 * The single-step "What's new" variant from the Figma reference: a close control,
 * a documentation link, and a "don't remind again" affordance instead of stepping.
 */
export const WhatsNew: Story = {
  args: { stepCount: 1, defaultOpen: true },
  render: (args) => (
    <Tour {...args}>
      <span className="relative inline-flex">
        <TourBeacon className="absolute -left-1 -top-1" />
        <TourTrigger render={<Button variant="secondary">Scope</Button>} />
      </span>
      <TourContent side="right" align="start">
        <TourClose />
        <TourHeader>
          <TourTitle>You changed the scope</TourTitle>
        </TourHeader>
        <TourBody className="flex flex-col gap-2">
          <TourDescription>
            Your selection is saved and applied across all Protection management
            features.
          </TourDescription>
          <Link href="#" external>
            See documentation
          </Link>
        </TourBody>
        <TourFooter className="justify-end">
          <TourNextButton>Got it</TourNextButton>
        </TourFooter>
      </TourContent>
    </Tour>
  ),
};

/** The optional dimming scrim behind the coach-mark. */
export const WithScrim: Story = {
  args: { stepCount: 3, defaultActiveStep: 0, defaultOpen: true },
  render: (args) => (
    <Tour {...args}>
      <span className="relative inline-flex">
        <TourBeacon className="absolute -left-1 -top-1" />
        <TourTrigger render={<Button variant="secondary">Overview</Button>} />
      </span>
      <TourScrim />
      <TourContent side="bottom" align="center">
        <TourClose />
        <TourHeader>
          <TourTitle>Welcome to the console</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>
            Everything dims except the active area so you can focus on one step at
            a time.
          </TourDescription>
        </TourBody>
        <TourFooter>
          <TourStepCounter />
          <TourActions>
            <TourSkipButton />
            <TourBackButton />
            <TourNextButton />
          </TourActions>
        </TourFooter>
      </TourContent>
    </Tour>
  ),
};

/** The "green light" beacon on its own — pulsing (default) and static. */
export const Beacon: Story = {
  args: { stepCount: 1 },
  render: () => (
    <div className="flex items-center gap-8">
      <TourBeacon />
      <TourBeacon pulse={false} />
    </div>
  ),
};
