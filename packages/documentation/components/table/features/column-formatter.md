# Column custom formatters

Column custom formatters are used to format the data in a column. They are used to display the data in a more readable format. The custom formatters are defined as functions that take the cell value as an argument and return the formatted value.

## Usage

To use a custom formatter, you need to define a function that takes the cell value as an argument and returns the formatted value. You can then pass this function to the `formatter` property of the column definition.

```vue
<template>
  <AcpDataTable
    :columns="columns"
    :data="data"
  />
</template>

<script>
const columns = [
  {
    label: 'Name',
    key: 'name',
    formatter: (value) => {
      return value.toUpperCase();
    },
  },
  {
    label: 'Position',
    key: 'position',
  },
  {
    label: 'Office',
    key: 'office',
  },
  {
    label: 'Age',
    key: 'age',
  },
  {
    label: 'Start date',
    key: 'start_date',
  },
  {
    label: 'Salary',
    key: 'salary',
  },
];
</script>
```

## Predefined formatters

The following predefined formatters are available:

- `date`: Formats the date value using the specified format.
- `number`: Formats the number value using the specified format.
- `currency`: Formats the currency value using the specified format.
- `percentage`: Formats the percentage value using the specified format.
- `boolean`: Formats the boolean value as a checkmark or a cross.
- `link`: Formats the value as a link.
- `image`: Formats the value as an image.
- `icon`: Formats the value as an icon.
- `badge`: Formats the value as a badge.
- `progress`: Formats the value as a progress bar.
- `color`: Formats the value as a color.
- `html`: Formats the value as HTML.
- `json`: Formats the value as JSON.
