<script setup>
  import { computed, ref } from 'vue';
  import data from './__data__/MOCK_DATA_1000.json';
  import columns from './__data__/columns.json';
  import MarkupTable from '@/components/markup-table/markupTable.vue';

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
    selectedRows.value.includes(id)
      ? selectedRows.value.splice(selectedRows.value.indexOf(id), 1)
      : selectedRows.value.push(id);
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
