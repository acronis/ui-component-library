---
'@constructor-lab/ui-react': minor
---

Add `ConfirmDialog` — a config-driven confirmation composite (`<ConfirmDialog title description confirmLabel destructive onConfirm />`) over the `AlertDialog` primitive. It bakes in the approved confirmation shape (title + consequence + a secondary Cancel and a default/destructive Confirm), traps focus, defaults focus to Cancel, and can't be dismissed by clicking outside. Supports controlled/uncontrolled open and an optional trigger. An opinionated composite (see the opinionated-composites proposal). Initial version; design reconciliation pending.
