<script setup>
  import tableData from '../__data__/data.mock.5.json';
  import columns from '../markup-table/__data__/columns.json';
  import AcvTable from '@/components/table/table.vue';
</script>

<template>
  <AcvTable
    :data="tableData"
    :columns="columns"
  >
    123
  </AcvTable>
</template>
