<script setup>
  import AcvTable from '@/components/table/table.vue';
  import AcvTableColumn from '@/components/table-column/tableColumn.vue';
  import tableData from '../../__mocks__/data.mock.5.json';
  </script>

<template>
  <AcvTable
    row-key="id"
    :data="tableData"
    stripe
  >
    <AcvTableColumn
      prop="date"
      label="Date"
      width="180"
    />
    <AcvTableColumn
      prop="name"
      label="Name"
      show-overflow-tooltip
      width="180"
    />
    <AcvTableColumn
      prop="address"
      label="Address"
      show-overflow-tooltip
    />
  </AcvTable>
</template>
