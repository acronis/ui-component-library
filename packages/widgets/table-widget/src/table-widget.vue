<template>
  <div
    v-if="data && data.points"
    class="el-table-widget"
  >
    <el-table
      row-key="rowKey"
      per-page="10"
      border-top
      size="compact"
      :data="data.points"
      max-height=400
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="(column, index) in data.columns"
        :key="index"
        sortable
        :prop="column.key"
        :label="column.value"
        min-width=100
        :sort-method="column.sort"
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <template v-if="$slots[column.key]">
            <slot
              :name="column.key"
              :value="scope.row[column.key]"
            />
          </template>
          <template v-else>
            {{scope.row[column.key]?scope.row[column.key]:'-'}}
          </template>
        </template>
      </el-table-column>
      <el-table-actions-column
        :initial-hidden-columns="data.initialHiddenColumns"
      >
        <div />
      </el-table-actions-column>
    </el-table>
  </div>
</template>

<script>
import ElTable from 'packages/table';

export default {
  name: 'ElTableWidget',
  components: {
    ElTable
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    rowKey: { type: [String, Function], required: true }
  },
  data() {
    return {
      emptyText: 'No data to be displayed'
    };
  },
  methods: {
    handleRowClick(row, event, column) {
      this.$emit('row-click', row, event, column);
    }
  }
};
</script>
