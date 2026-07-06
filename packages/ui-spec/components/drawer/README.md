# Drawer

A panel that slides in from a screen edge with swipe-to-dismiss gestures.

> **Status: draft (design-pending v1).** Wraps Base UI's `Drawer` primitive
> (which extends Dialog and adds drag physics + snap points). Themes on the
> shared semantic tokens like the Sheet/Dialog family — no `--ui-drawer-*` tier
> yet. Reconcile with `/figma-component Drawer <url> --update` once a mockup is
> ready for dev.

## Drawer vs Sheet

Both slide in from an edge. Reach for **Drawer** when you want touch
swipe-to-dismiss gestures and edge affordances (mobile bottom sheets, drag
handles). Reach for **Sheet** for a plain desktop side panel — it is a
positioned Dialog with no gesture layer. They are independent components.

## When to use

- A mobile-style bottom sheet for notifications, quick actions, or a short form.
- An edge panel where swipe-to-dismiss is a natural affordance.

## When not to use

- A centered confirmation or short form — use `Dialog`.
- A desktop detail side panel without gestures — use `Sheet`.
- Persistent, non-modal page chrome — use a sidebar (`SidebarSecondary`).

## Parts

| Part                | Element | Purpose                                                |
| ------------------- | ------- | ------------------------------------------------------ |
| `Drawer`            | —       | Root; owns open state and the `side` edge.             |
| `DrawerTrigger`     | button  | Opens the drawer (polymorphic via `render`).           |
| `DrawerContent`     | div     | The portaled panel (backdrop + viewport + popup).      |
| `DrawerSwipeArea`   | div     | Grab handle / swipe-to-open area.                      |
| `DrawerHeader`      | div     | Title + close bar.                                     |
| `DrawerTitle`       | h2      | Accessible name.                                       |
| `DrawerCloseButton` | button  | Dismiss (×) button.                                    |
| `DrawerBody`        | div     | Scrollable content region.                             |
| `DrawerDescription` | p       | Supporting text.                                       |
| `DrawerFooter`      | div     | Right-aligned action bar.                              |
| `DrawerClose`       | button  | Any element that dismisses (polymorphic).              |
| `DrawerPopup`       | div     | The sliding panel (granular; used by `DrawerContent`). |
| `DrawerViewport`    | div     | Edge-pinning container (granular).                     |
| `DrawerBackdrop`    | div     | Scrim behind the panel (granular).                     |

## Example

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerSwipeArea,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
  DrawerBody,
  DrawerDescription,
  DrawerFooter,
  Button,
} from '@spec-lab/ui-react';

<Drawer side="bottom">
  <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
  <DrawerContent>
    <DrawerSwipeArea />
    <DrawerHeader>
      <DrawerTitle>Notifications</DrawerTitle>
      <DrawerCloseButton />
    </DrawerHeader>
    <DrawerBody>
      <DrawerDescription>You are all caught up.</DrawerDescription>
    </DrawerBody>
    <DrawerFooter>
      <Button>Mark all read</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>;
```
