---
'@constructor-lab/ui-react': minor
---

feat(toast): reconcile against the redesigned Figma "Notification" (node 6946-25164) + add `Notification` alias

- **Restyle** toasts to the new design language (shared with the redesigned
  Alert): white surface (`bg-background`) + **strong status border**
  (`--ui-border-on-status-*-strong`) + a **6px left accent bar**
  (`--ui-background-status-strong-*`) + a **full-color status icon**
  (CircleInfoBlue / CircleCheckGreen / TriangleWarningYellow / DiamondWarningRed)
  - a **compact 32px ButtonIcon** close + a floating shadow. Status maps:
    `success`/`info`/`warning` as-is; `error` → the danger tokens; `loading` and
    untyped toasts stay neutral (plain `border-border`, no accent).
- **Add `Notification` / `notification` aliases** (the Figma component is named
  "Notification", and toasts are this kit's notification pattern):
  `Notification` = `Toaster` (the region), `notification` = `toast` (the trigger
  API, with `.success`/`.error`/… helpers), `NotificationProps` = `ToasterProps`.

Code Connect completed (node 6946-25164); ui-spec index/tokens/anatomy updated;
VR baselines regenerated.
