# Fixed Columns

Fixed Columns feature makes use of position: sticky in CSS.
All evergreen browsers have good support for this property, but legacy browsers such as Internet Explorer do not.

## Overview

Fixed Columns feature allows you to make a column sticky while scrolling the table horizontally.

FixedColumns provides the following features for a horizontally scrolling table:
- It freezes the left(right) most column to the side of the table
- Option to freeze two or more columns
- Full integration with DataTables' scrolling options

## Setup

To make a column sticky, you need to add the `fixed` property to the `AcpDataTableColumn` config.

```vue
<script>
  const columns = [
    {
      label: 'Name',
      key: 'name',
      fixed: 'left',
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
  
    const data = [
        {
        name: 'Tiger Nixon',
        position: 'System Architect',
        office: 'Edinburgh',
        age: 61,
        start_date: '2011/04/25',
        salary: '$320,800',
        }
    ];
</script>

<template>
  <AcpDataTable
    :columns="columns"
    :data="data"
  />
</template>
```
