# Autocomplete — Behavior Scenarios

## Rendering

### Renders a closed field by default

**Given** an Autocomplete with `items`
**When** it renders
**Then** the field box is shown with its placeholder
**And** the suggestion dropdown is closed

---

## Interaction

### Opens and filters as the user types

**Given** an Autocomplete with `items`
**When** the user types into the field
**Then** the dropdown opens
**And** only suggestions matching the typed text are listed
**And** `value-change` fires with the typed string

### Choosing a suggestion fills the input

**Given** an open Autocomplete
**When** the user clicks (or presses Enter on) a suggestion
**Then** the input value becomes that suggestion's text
**And** `value-change` fires with it
**And** the dropdown closes

### Keeps free text with no match

**Given** the user types text matching no suggestion
**When** filtering runs
**Then** the input keeps the typed text as the value
**And** the empty message is shown

### Clears the value

**Given** an AutocompleteInput with `clearable` and a value
**When** the user activates the clear button
**Then** the value becomes empty
**And** `value-change` fires with an empty string

### Escape closes the dropdown

**Given** an open Autocomplete
**When** the user presses Escape
**Then** the dropdown closes
**And** the typed value is preserved

---

## Edge Cases

### Disabled blocks interaction

**Given** an Autocomplete with `disabled`
**When** the user attempts to type or open it
**Then** nothing happens and no events fire

### Controlled value defers to the consumer

**Given** an Autocomplete with a controlled `value`
**When** the user types
**Then** `value-change` fires with the requested text
**And** the input updates only when the consumer updates `value`
