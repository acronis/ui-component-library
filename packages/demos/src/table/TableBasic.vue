<script setup>
  import AcvTable from '@/components/table/table.vue';
  import tableData from '../__data__/data.mock.5.json';
  import columns from '../__data__/data.mock.table.columns.json';
</script>

<template>
  <AcvTable
    :data="tableData"
    :columns="columns"
  >
    123
  </AcvTable>
</template>
