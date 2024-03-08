---
title: Search
lang: en-US
editLink: true
---

# Search

Used to find or filter content. Search can be global or local, search across all sections of the interface, within the selected section or a drop-down list with predefined values.

## Basic usage

<BasicSearch />

::: details Source code
<<< ../../examples/components/search/Basic.vue
:::

## Embedded

<EmbededSearch />

::: details Source code
<<< ../../examples/components/search/Embeded.vue
:::

## With autocomplete

<AutocompleteSearch />

## Attributes

| Attribute     | Description                                 | Type     | Accepted Values                     | Default         |
| ------------- | ------------------------------------------- | -------- | ----------------------------------- | -------         |
| autocomplete  | Show hints when input.                       | boolean  | true / false                        | false           |
| maxlength     | Text search maximum length.                  | Number   | -                                   | 0 (no limit)    |
| noDataMessage | Message when no matches.                     | string   | —                                   | 'No data found' |
| value         | Predefined value or via model.               | string   | —                                   | ''              |
| type          | Type of search.                              | string   | default / embedded / embedded-large | default         |
| placeholder   | A short hint describing the expected value.  | string   | —                                   | ''              |
| suggestionsClass   | Allow extend of popper class.           | string   | —                                   | ''              |

## Events

| Event Name  | Description                                           | Parameters    |
| --------    | ----------------------------------------------------- | ----------    |
| select      | Triggers when the selected value changes immediately.  | current value |
| input       | Triggers when the input value changes immediately.     | current value |
| clear       | Triggers when user click on clear.                     | -             |
| search-collapse | Triggers when embedded-large collapse or expand.   | isCollapse    |

<script setup>
  import BasicSearch from 'examples/components/search/Basic.vue';
  import EmbededSearch from 'examples/components/search/Embeded.vue';
  import AutocompleteSearch from 'examples/components/search/Autocomplete.vue';
</script>