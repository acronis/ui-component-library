# Autocomplete

A free-text input with a filtered list of suggestions. The value is whatever the
user types; the suggestions are just completions. Reach for it when the field is
open-ended but a set of likely values helps — search-as-you-type, city/country
entry, tags, or email addresses.

> **Design-pending v1.** Wraps Base UI `Autocomplete`; reuses the
> `--ui-input-select-*` tokens (matches InputSelect / Combobox). No Figma node
> yet — reconcile with `/figma-component Autocomplete <url> --update` when a
> mockup lands.

## When to Use

- Open-ended text where suggestions speed entry but any value is allowed.
- Search fields that surface matching results as the user types.
- Tag/email entry where typed values need not come from a fixed list.

## When NOT to Use

- The value **must** be one of a fixed set — use `Combobox` (constrained
  selection) or `Select` (no typing).
- A short, non-searchable set of options — use `RadioGroup` or `Select`.
- Plain free text with no suggestions — use `InputText`.

## Quick Examples

### React

```tsx
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from '@spec-lab/ui-react';

const countries = ['Australia', 'Austria', 'Belgium', 'Canada'];

<Autocomplete items={countries}>
  <AutocompleteInput placeholder="Search country…" clearable />
  <AutocompleteContent>
    <AutocompleteEmpty>No match — keep what you typed.</AutocompleteEmpty>
    <AutocompleteList>
      {(item: string) => (
        <AutocompleteItem key={item} value={item}>
          {item}
        </AutocompleteItem>
      )}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>;
```

Inside a shadow root or other portal host, pass `portalContainer` to
`AutocompleteContent` so the popup inherits styles.

## Parts

| Part                     | Element | Notes                                        |
| ------------------------ | ------- | -------------------------------------------- |
| root                     | `div`   | Holds items + typed value; filters.          |
| autocomplete-input       | `input` | Field box (typeable) + optional clear.       |
| autocomplete-content     | `div`   | Portaled dropdown surface.                   |
| autocomplete-list        | `div`   | The filtered suggestion list.                |
| autocomplete-item        | `div`   | One suggestion; fills the input when chosen. |
| autocomplete-empty       | `div`   | "No match" message.                          |
| autocomplete-group       | `div`   | Optional group of suggestions.               |
| autocomplete-group-label | `div`   | Group heading.                               |

## Spec Files

| File               | Contents                                          |
| ------------------ | ------------------------------------------------- |
| `index.yaml`       | Identity, status, category                        |
| `anatomy.yaml`     | Root, compound parts, open state                  |
| `api.yaml`         | Framework-agnostic contract + framework adapters  |
| `tokens.yaml`      | `--ui-input-select-*` references                  |
| `behavior.md`      | Given/When/Then behavior scenarios                |
| `accessibility.md` | Combobox roles, keyboard, screen-reader, contrast |
