<template>
  <el-dropdown
    v-if="table.showColumnsSelector"
    ref="headerDropdown"
    class="el-table__columns-visibility"
    flyweight
    placement="bottom-end"
    trigger="click"
    :disabled="table.disableColumnsSelector"
    :hide-on-click="false"
  >
    <el-button
      :disabled="table.disableColumnsSelector"
      type="ghost"
      :icon="table.headerActionsIcon"
    />
    <template #dropdown>
      <el-dropdown-menu
        class="el-table__columns-selector"
      >
        <el-checkbox
          v-for="column in availableColumns"
          :key="column.id+column.columnKey"
          class="el-table__columns-selector-option"
          :value="!column.hidden"
          :disabled="visibleColumnsLength === 1 && !column.hidden"
          @change="updateVisibility(column)"
        >
          {{ column.label }}
        </el-checkbox>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { COLUMN_TYPES } from 'packages/table/src/table-constants';

export default {
  name: 'ElTableColumnsVisibility',
  computed: {
    table() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },
    visibleColumnsLength() {
      return this.availableColumns.filter((c) => !c.hidden).length;
    },
    availableColumns() {
      return this.table.columns
        .filter((c) => !c.default)
        .filter((column) => column.columnKey && column.type !== COLUMN_TYPES.ACTIONS)
        .filter(this.table.selectableColumnsFilter);
    }
  },
  methods: {
    updateVisibility(column) {
      this.table.changeColumnVisibility(column.columnKey, !column.hidden);
    }
  }
};
</script>
