<script setup>
  import AcvTable from '@/components/table/table.vue';
  import tableData from '../../__mocks__/data.mock.5.json';
  import columns from '../../__mocks__/data.mock.table.columns.json';
</script>

<template>
  <AcvTable
    :data="tableData"
    :columns="columns"
  >
    123
  </AcvTable>
</template>
