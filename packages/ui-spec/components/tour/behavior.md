# Tour — behavior

Given/When/Then scenarios for the coach-mark. The `Tour` root owns the open
state and the active step index; the parts read that state.

## Opening and closing

- **Given** a `Tour` with a `trigger`, **when** the user activates the trigger,
  **then** the coach-mark opens anchored to its target and `open-change(true)`
  fires.
- **Given** an open coach-mark, **when** the user presses `Esc`, clicks outside,
  or activates the `close` button, **then** it closes and `open-change(false)`
  fires.
- **Given** a controlled `open`, **when** a dismissal gesture occurs, **then** the
  internal state does not change on its own — the component emits `open-change`
  and the consumer updates the `open` prop.

## Stepping

- **Given** step `n` of `N` (n > 0), **when** the user activates **Back**,
  **then** the active step becomes `n-1` and `active-step-change(n-2)` fires
  (0-based).
- **Given** step 1 of `N` (the first step), **then** the **Back** button is
  disabled.
- **Given** step `n` of `N` (n < N), **when** the user activates **Next**,
  **then** the active step advances and `active-step-change` fires.
- **Given** the last step (`active-step === step-count - 1`), **then** the
  **Next** button reads "Done"; **when** the user activates it, **then**
  `complete` fires and the coach-mark closes.
- **Given** any step, **when** the user activates **Skip**, **then** `skip` fires
  and the coach-mark closes.
- The step counter renders the 1-based current step over the total, e.g.
  "2 of 5" (customizable via `format`).

## Beacon

- **Given** a `beacon` marking a target, **then** it renders a decorative
  (`aria-hidden`) pulsing "green light".
- **When** `pulse` is `false`, **then** the beacon renders a static dot with no
  animated ring (used for reduced-motion contexts and stable snapshots).

## Anchoring (consumer-owned)

- Positioning the coach-mark against a specific DOM target (`anchor`), scrolling
  the target into view, and persisting a "seen once" flag are left to the
  consumer; the component stays focused on presentation and step navigation.
