<script setup>
  import MarkupTable from '@/components/markup-table/markupTable.vue';
  import { computed, ref } from 'vue';
  import data from '../../__mocks__/data.mock.table.1000.json';
  import columns from '../../__mocks__/data.mock.table.columns.json';

  const selectedRows = ref([]);

  const allRowsSelected = computed(() => selectedRows.value.length === data.length);

  function rowIsSelected(rowId) {
    return selectedRows.value?.includes(rowId);
  }

  function selectAllRows() {
    selectedRows.value = allRowsSelected.value ? [] : data.map(row => row.id);
    console.log('Select all rows');
  }

  function toggleRowSelection(id) {
    const index = selectedRows.value.indexOf(id);
    if (index !== -1) {
      selectedRows.value.splice(index, 1);
    }
    else {
      selectedRows.value.push(id);
    }
  }
</script>

<template>
  <MarkupTable
    :data="data"
    :columns="columns"
  >
    <template #header_id>
      <span>
        <input
          type="checkbox"
          :checked="selectedRows.length === data.length"
          @click="selectAllRows"
        >
      </span>
    </template>
    <template #column_id="{ row }">
      <span>
        <input
          type="checkbox"
          :checked="rowIsSelected(row.id)"
          @click="toggleRowSelection(row.id)"
        >
      </span>
    </template>
    <template #column_lastName="{ row }">
      <span class="nowrap">{{ row.lastName }}</span>
    </template>
  </MarkupTable>
</template>

<style scoped>
.nowrap {
  display: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
