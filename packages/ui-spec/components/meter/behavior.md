# Meter — Behavior Scenarios

## Rendering

### Fills to the value's position in the range

**Given** a Meter with `value` 72 (default `min` 0, `max` 100)
**When** it renders
**Then** the indicator fills 72% of the track
**And** `aria-valuenow` is 72

### Respects a custom range

**Given** a Meter with `value` 512, `min` 0, `max` 1024
**When** it renders
**Then** the indicator fills 50% of the track
**And** `aria-valuemin`/`aria-valuemax` reflect 0/1024

### Formats the displayed value

**Given** a Meter with `format` of `{ style: 'unit', unit: 'gigabyte' }`
**When** the value renders in `MeterValue`
**Then** it is shown as a localized unit string (e.g. "512 GB")

### Shows the label

**Given** a Meter with a `MeterLabel`
**When** it renders
**Then** the label text names the measurement

---

## Edge Cases

### Clamps out-of-range values

**Given** a Meter with `value` above `max` (or below `min`)
**When** it renders
**Then** the indicator does not overflow the track (fill clamps to 0–100%)

### Static, never indeterminate

**Given** a Meter
**When** it renders
**Then** it always reflects a concrete value — unlike `Progress`, it has no
indeterminate state
