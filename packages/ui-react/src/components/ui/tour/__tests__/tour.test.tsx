import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

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
  TourSkipButton,
  TourStepCounter,
  TourTitle,
  TourTrigger,
  type TourProps,
} from '../tour';

function DemoTour(props: Partial<TourProps>) {
  return (
    <Tour stepCount={3} defaultOpen {...props}>
      <TourTrigger>Start tour</TourTrigger>
      <TourContent data-testid="popup">
        <TourClose />
        <TourHeader>
          <TourTitle>Primary navigation</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>Jump between product areas here.</TourDescription>
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
  );
}

describe('Tour', () => {
  it('is closed by default and opens from the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tour stepCount={2}>
        <TourTrigger>Start tour</TourTrigger>
        <TourContent>
          <TourHeader>
            <TourTitle>Welcome</TourTitle>
          </TourHeader>
        </TourContent>
      </Tour>
    );
    expect(screen.queryByText('Welcome')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start tour' }));
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('renders the step counter and advances / retreats through steps', async () => {
    const user = userEvent.setup();
    render(<DemoTour />);

    expect(screen.getByText('1 of 3')).toBeInTheDocument();
    // Back is disabled on the first step.
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('1 of 3')).toBeInTheDocument();
  });

  it('labels the Next button "Done" on the last step and fires onComplete', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<DemoTour onComplete={onComplete} />);

    await user.click(screen.getByRole('button', { name: 'Next' })); // -> step 2
    await user.click(screen.getByRole('button', { name: 'Next' })); // -> step 3 (last)
    expect(screen.getByText('3 of 3')).toBeInTheDocument();

    const done = screen.getByRole('button', { name: 'Done' });
    await user.click(done);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Primary navigation')).not.toBeInTheDocument();
  });

  it('fires onSkip and closes when the tour is skipped', async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    render(<DemoTour onSkip={onSkip} />);

    await user.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Primary navigation')).not.toBeInTheDocument();
  });

  it('supports a controlled active step', () => {
    const onActiveStepChange = vi.fn();
    render(
      <DemoTour activeStep={1} onActiveStepChange={onActiveStepChange} />
    );
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
  });

  it('exposes an accessible close control', async () => {
    const user = userEvent.setup();
    render(<DemoTour />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Primary navigation')).not.toBeInTheDocument();
  });

  it('themes the coach-mark popup from the semantic tokens', () => {
    render(<DemoTour />);
    expect(screen.getByTestId('popup')).toHaveClass(
      'bg-background',
      'text-foreground',
      'border-primary'
    );
  });

  it('renders a decorative beacon with the strong-success green', () => {
    render(<TourBeacon data-testid="beacon" />);
    const beacon = screen.getByTestId('beacon');
    expect(beacon).toHaveAttribute('aria-hidden', 'true');
    expect(
      beacon.querySelector(
        '.bg-\\[var\\(--ui-background-status-strong-success\\)\\]'
      )
    ).not.toBeNull();
  });

  it('omits the pulse ring when pulse is false', () => {
    render(<TourBeacon data-testid="beacon" pulse={false} />);
    expect(
      screen.getByTestId('beacon').querySelector('.animate-ping')
    ).toBeNull();
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tour stepCount={1} defaultOpen>
        <TourContent ref={ref}>content</TourContent>
      </Tour>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
