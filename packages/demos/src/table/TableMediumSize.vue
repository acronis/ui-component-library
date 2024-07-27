<script setup>
  import tableData from '../__data__/data.mock.5.json';
  import AcvTable from '@/components/table/table.vue';
  import AcvTableColumn from '@/components/table-column/tableColumn.vue';
</script>

<template>
  <AcvTable
    row-key="id"
    :data="tableData"
    size="medium"
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
