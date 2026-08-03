---
'@constructor-lab/tokens': patch
---

Drop the empty `Notification` stylesheet from the CSS bundle

The `Notification` tier consists entirely of two malformed Figma duplicates
(`content/gap 2`, `success/icon 2`), so after both were skipped as unrepresentable
it rendered an empty `:root, :host {}` that `index.css` still imported. A tier with
nothing renderable now emits no file and no import; the build's skipped-token
report is where the reason belongs.

No token is lost — `--ui-notification-*` never had a consumer (Figma's
"Notification" component is implemented as `Toast`, on its own healthy tier), and
the compiled `ui-react` bundle referenced none of them before or after.
