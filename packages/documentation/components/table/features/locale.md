# Table locale feature

The locale feature allows you to customize the text displayed in the table.

```json
{
  "table": {
    "emptyText": "No Data"
  }
}
```

You can update the text displayed when the table is empty by
- setting the `emptyText` property in the locale object.
- passing localized component into empty table slot.
- the `emptyText` property will be used to display the text when the table is empty.

```vue
<template>
  <AcpDataTable
    :columns="columns"
    :data="data"
    :locale="locale"
  />
  <AcpDataTable
    :columns="columns"
    :data="data"
    :empty-text="'Ingen data'"
  />
</template>
```
