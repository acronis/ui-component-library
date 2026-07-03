# Carousel — accessibility

## Roles & ARIA

- Root is `role="region"` with `aria-roledescription="carousel"`. Give it an
  accessible name (`aria-label`, e.g. "Photos").
- Each slide is `role="group"` with `aria-roledescription="slide"`.
- Previous / Next are real `<button>`s (ghost `Button`s showing "Prev" / "Next"
  with `aria-label` "Previous slide" / "Next slide"); they become `disabled` at
  the respective edge (unless looping).
- The pagination dots are a `role="tablist"` (labelled "Slides") of
  `role="tab"` buttons; the active dot has `aria-selected` and each is labelled
  "Go to slide N".

## Keyboard

| Key                    | Action                              |
| ---------------------- | ----------------------------------- |
| ArrowLeft / ArrowRight | Scroll to the previous / next slide |
| Tab                    | Move to the Previous / Next buttons |
| Enter / Space          | Activate the focused control        |

Keyboard scrolling is handled on the region (`onKeyDownCapture`); the controls
are independently focusable buttons.

## Focus

- The controls are standard buttons in the tab order; a disabled control is
  skipped. Focus is not trapped — the carousel is a region, not a modal.

## Screen reader

- The region and slide roles convey "carousel" / "slide N". Author meaningful
  slide content (e.g. alt text on images). Consider `aria-live` on the viewport
  only if slides advance automatically.

## Contrast

- The controls resolve to `--ui-button-icon-*` tokens meeting the kit's contrast
  targets in light and dark. Slide content contrast is the consumer's
  responsibility.
