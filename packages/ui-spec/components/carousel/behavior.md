# Carousel — behavior

Given/When/Then scenarios for the carousel. The scroll engine (drag, snap, loop)
is provided by embla in the React adapter.

## Navigation

- **Given** a carousel, **when** the user clicks **Next**, **then** it scrolls to
  the next slide; clicking **Previous** scrolls back.
- **Given** the carousel is focused, **when** the user presses **ArrowRight /
  ArrowLeft**, **then** it scrolls to the next / previous slide.
- **Given** a touch/pointer device, **when** the user drags across the slides,
  **then** they scroll and snap to the nearest slide.
- **Given** the pagination dots, **when** the user clicks a dot, **then** the
  carousel scrolls to that slide and the dot becomes active. The active dot
  tracks the current slide as the user scrolls or drags.

## Edge state

- **Given** the carousel is at the first slide and not looping, **then** the
  **Previous** control is disabled (`at-start`).
- **Given** the carousel is at the last slide and not looping, **then** the
  **Next** control is disabled (`at-end`).
- **Given** `opts={{ loop: true }}`, **then** neither control disables — scrolling
  past an end wraps around.

## Orientation

- **Given** `orientation="vertical"`, **then** the track lays out top-to-bottom
  and the controls sit above / below (rotated); ArrowUp/Down semantics follow the
  engine.

## Imperative api

- **Given** `setApi`, **when** the carousel mounts, **then** the consumer receives
  the engine `api` (`scrollPrev` / `scrollNext` / `scrollTo` / `on('select', …)`)
  for programmatic control (e.g. autoplay, external dots).
