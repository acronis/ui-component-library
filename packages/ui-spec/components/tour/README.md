# Tour

A guided-onboarding **coach-mark**: a stepped popover anchored to a target that
gets a pulsing **beacon** ("green light") and an optional dimming **scrim**. Use
it to walk a first-time user through the landmarks of a screen — primary nav,
search, a key action — one step at a time, with a title, body, a "2 of 5" step
counter, and **Next / Back / Skip** controls.

> **Design-pending v1.** There is no `--ui-tour-*` token tier yet, so the
> coach-mark themes from the shared semantic tokens. Reconcile with the Figma
> reference (Main-menu-improvements, node `1608-126436`) via
> `/figma-component Tour <url> --update` once the mockup is ready for dev — that
> pass also adds the Code Connect link and the `figma:` block. See "Known gaps"
> below.

## When to use

- First-visit onboarding that highlights several landmarks in sequence.
- A single "what's new" / "you changed X" callout anchored to one control.
- Re-triggerable product tours (from a Help menu) driven by the consumer.

## When not to use

- A plain hover hint → use `Tooltip`.
- A click-triggered panel of options → use `Popover`.
- A blocking, modal task → use `Dialog` / `Drawer`.

## Parts

| Part              | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `Tour`            | Root controller — owns the active step index and open state.         |
| `TourTrigger`     | Opens the tour (Base UI `Popover.Trigger`). Optional.                |
| `TourBeacon`      | The decorative pulsing "green light" marking a target.               |
| `TourScrim`       | Optional full-screen dimming backdrop.                               |
| `TourContent`     | The coach-mark panel (accepts `side`/`align`/`sideOffset`/`anchor`). |
| `TourClose`       | Close (X) control.                                                   |
| `TourHeader`      | Header region.                                                       |
| `TourTitle`       | Accessible name (`Popover.Title`).                                   |
| `TourDescription` | Body text (`Popover.Description`).                                   |
| `TourBody`        | Content region.                                                      |
| `TourFooter`      | Footer with the counter + actions and a top divider.                 |
| `TourStepCounter` | Renders "2 of 5" from the root state (customizable via `format`).    |
| `TourActions`     | Layout wrapper for the navigation buttons.                           |
| `TourNextButton`  | Advances / completes (Button, primary; "Done" on the last step).     |
| `TourBackButton`  | Retreats (Button, secondary; disabled on the first step).            |
| `TourSkipButton`  | Dismisses without completing (Button, ghost).                        |

## Example

```tsx
<Tour stepCount={5} defaultOpen onComplete={markSeen} onSkip={markSeen}>
  <TourTrigger render={<Button variant="secondary">Protection</Button>} />
  <TourContent side="right">
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
```

Anchoring the coach-mark to a specific target (`anchor`), scroll-into-view, and
persisting "seen once" are left to the consumer (e.g. the demo console portal),
which drives the active step and open state.

## Known gaps (flagged for the token/Figma pass)

- **Beacon color** reuses `--ui-background-status-strong-success` (the status
  green). A dedicated coach-mark/beacon token may be warranted.
- **Spotlight cut-out.** The scrim dims uniformly; there is no mask that punches a
  hole around the active target. That needs an upstream token/primitive.
