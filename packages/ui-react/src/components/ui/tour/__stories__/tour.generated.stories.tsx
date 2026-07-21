// AUTO-GENERATED from @constructor-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @constructor-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import {
  TourTrigger,
  TourContent,
  TourClose,
  TourHeader,
  TourTitle,
  TourBody,
  TourDescription,
  TourFooter,
  TourStepCounter,
  TourActions,
  TourSkipButton,
  TourBackButton,
  TourNextButton,
} from '../tour';
import { Tour } from '../tour';

const meta = {
  title: 'Components/Tour/All States (generated)',
  component: Tour,
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Tour stepCount={3} defaultOpen>
        <TourTrigger>Start</TourTrigger>
        <TourContent>
          <TourClose />
          <TourHeader>
            <TourTitle>Protection management</TourTitle>
          </TourHeader>
          <TourBody>
            <TourDescription>Manage backups and recovery here.</TourDescription>
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
    </div>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <Tour stepCount={3} defaultOpen>
      <TourTrigger>Start</TourTrigger>
      <TourContent>
        <TourClose />
        <TourHeader>
          <TourTitle>Protection management</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>Manage backups and recovery here.</TourDescription>
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
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};

// transition "open": trigger click -> true
export const Open: Story = {
  render: () => (
    <Tour stepCount={3} defaultOpen>
      <TourTrigger>Start</TourTrigger>
      <TourContent>
        <TourClose />
        <TourHeader>
          <TourTitle>Protection management</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>Manage backups and recovery here.</TourDescription>
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
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "close": close button / Esc / outside press / Skip / Next on last step -> false
export const Close: Story = {
  render: () => (
    <Tour stepCount={3} defaultOpen>
      <TourTrigger>Start</TourTrigger>
      <TourContent>
        <TourClose />
        <TourHeader>
          <TourTitle>Protection management</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>Manage backups and recovery here.</TourDescription>
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
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "next": Next button (not on the last step) -> active-step + 1 [guard: active-step < step-count - 1]
export const Next: Story = {
  render: () => (
    <Tour stepCount={3} defaultOpen>
      <TourTrigger>Start</TourTrigger>
      <TourContent>
        <TourClose />
        <TourHeader>
          <TourTitle>Protection management</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>Manage backups and recovery here.</TourDescription>
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
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};

// transition "back": Back button -> active-step - 1 [guard: active-step > 0]
export const Back: Story = {
  render: () => (
    <Tour stepCount={3} defaultOpen>
      <TourTrigger>Start</TourTrigger>
      <TourContent>
        <TourClose />
        <TourHeader>
          <TourTitle>Protection management</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>Manage backups and recovery here.</TourDescription>
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
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="dialog"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};
