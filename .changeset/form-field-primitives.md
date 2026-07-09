---
'@spec-lab/ui-react': minor
---

Add four Base UI form primitives so more of the form/field surface is covered:

- `CheckboxGroup` — shared state for a set of `Checkbox`es (reads/writes a
  `string[]` of the ticked names); pairs with `Field` / `FieldSet`.
- `OTPField` (`OTPFieldInput`, `OTPFieldSeparator`) — a segmented one-time-code
  input for verification / 2FA, with paste-to-fill and optional masking.
- `Autocomplete` (`AutocompleteInput`, `AutocompleteContent`, `AutocompleteList`,
  `AutocompleteItem`, `AutocompleteEmpty`, `AutocompleteGroup`,
  `AutocompleteGroupLabel`) — a free-text input with filtered suggestions, reusing
  the `--ui-input-select-*` tokens.
- `Meter` (`MeterLabel`, `MeterValue`, `MeterTrack`, `MeterIndicator`) — a static
  measurement bar (quota, usage, strength) distinct from `Progress`.
