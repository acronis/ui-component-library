# Meter

Shows a static measurement within a known range — disk usage, a backup quota, a
password-strength score. It answers "how much of a whole", as a fixed reading.

> **Design-pending v1.** Wraps Base UI `Meter`; the track/indicator reuse the
> shared `bg-input` / `bg-secondary` tokens (matching Progress). No Figma node
> yet — reconcile with `/figma-component Meter <url> --update` when a mockup
> lands.

## When to Use

- A static quantity within a range: storage used, quota consumed, capacity.
- A derived score shown as a level (password strength, health).
- Any "X of Y" reading that isn't advancing over time.

## When NOT to Use

- **Task advancement** (loading, upload, steps completed) — use `Progress`
  (`role="progressbar"`), which can also be indeterminate.
- A single boolean/threshold — a badge or status text is clearer.
- Interactive value selection — use `Slider`.

## Quick Examples

### React

```tsx
import {
  Meter,
  MeterLabel,
  MeterValue,
  MeterTrack,
} from '@constructor-lab/ui-react';

<Meter value={72}>
  <div className="flex items-center justify-between">
    <MeterLabel>Storage used</MeterLabel>
    <MeterValue />
  </div>
  <MeterTrack />
</Meter>;
```

Format the value (percent by default) with `format` / `locale`, and set a custom
range with `min` / `max`. `MeterTrack` renders a default `MeterIndicator` when
given no children.

## Parts

| Part      | Element                | Notes                               |
| --------- | ---------------------- | ----------------------------------- |
| root      | `div` (`role="meter"`) | Carries the value and ARIA range.   |
| label     | `span`                 | Names the measurement (optional).   |
| value     | `span`                 | Formatted current value (optional). |
| track     | `div`                  | Full-width rail.                    |
| indicator | `div`                  | Fill sized from the value.          |

## Spec Files

| File               | Contents                                               |
| ------------------ | ------------------------------------------------------ |
| `index.yaml`       | Identity, status, category                             |
| `anatomy.yaml`     | Root, label/value/track/indicator parts                |
| `api.yaml`         | Framework-agnostic contract + framework adapters       |
| `tokens.yaml`      | Track/indicator/value token references                 |
| `behavior.md`      | Given/When/Then behavior scenarios                     |
| `accessibility.md` | Meter role, meter-vs-progress, screen-reader, contrast |
