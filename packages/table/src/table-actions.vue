<template>
  <el-dropdown
    class="el-table__actions"
    flyweight
    placement="bottom-end"
    :disabled="actionsDisabled"
    @click.stop
    @command="triggerAction"
  >
    <span
      :class="{
        'el-dropdown-link': true,
        'is-disabled': actionsDisabled
      }"
    >
      <el-button
        type="ghost"
        :icon="actionsIcon"
        :color="isDropdownEmpty ? 'brand-light' : 'brand-primary'"
        :disabled="actionsDisabled"
      />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <slot>
          <el-table-action-item
            v-for="action in rowActions"
            :key="action.name || action.label"
            :action="action"
            :item="row"
          />
        </slot>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import ElTableActionItem from 'packages/table/src/table-action-item.vue';

export default {
  name: 'ElTableActions',
  components: { ElTableActionItem },
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      required: true
    },
    isSelected: Boolean,
    disabled: Boolean
  },
  emits: ['command'],
  computed: {
    table() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },
    actionsIcon() {
      return this.table?.actionsIcon;
    },
    rowActions() {
      return this.actions || this.table.rowActions;
    },
    actionsDisabled() {
      return this.disabled || this.isSelected || this.isDropdownEmpty;
    },
    isDropdownEmpty() {
      return !(this.rowActions.length || this.$slots.default?.()?.length);
    }
  },
  methods: {
    triggerAction({ item, command, action }) {
      this.$emit('command', { command, item });

      switch (action) {
        default:
          return typeof action === 'function' ? action(item, command) : '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  outline: none;

  &.is-disabled {
    pointer-events: none;
    cursor: default;
  }

  .el-button::-moz-focus-inner,
  .el-button:focus {
    border: 0;
    outline: none;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;

  .i {
    margin-right: 8px;
  }
}
</style>
