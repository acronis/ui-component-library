<script>
  import tableData from '../../__mocks__/data.mock.5.json';

  export default {
    data() {
      return {
        tableData,
        cols: [
          { type: 'selection', border: true, width: 64 },
          {
            prop: 'date',
            label: 'Date',
            width: 180,
            sortable: true
          },
          {
            prop: 'name',
            label: 'Name',
            width: 180,
            sortable: true,
            showOverflowTooltip: true
          },
          {
            prop: 'address',
            label: 'Address',
            width: 180,
            showHint: true,
            showOverflowTooltip: true
          },
        ]
      };
    }
  };
</script>

<template>
  <div>
    <acv-table
      row-key="id"
      :data="tableData"
      :default-sort="{ prop: 'name', order: 'descending' }"
      :cols="cols"
      border-bottom
    />
  </div>
</template>
