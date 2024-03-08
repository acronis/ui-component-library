<template>
  <el-dropdown
    class="el-tile__actions"
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
          <el-tile-action-item
            v-for="(action, index) in actions"
            :key="`${action.name || action.command}-${index}`"
            :i18n="i18n"
            :action="action"
            :item="row"
          />
        </slot>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import ElTileActionItem from './tile-action-item';

export default {
  name: 'ElTileActions',
  components: { ElTileActionItem },
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      required: true
    },
    disabled: Boolean,
    i18n: { type: Object, default: null }
  },
  computed: {
    actionsIcon() {
      return 'i-ellipsis-h--16';
    },
    rowActions() {
      return this.actions;
    },
    actionsDisabled() {
      return this.disabled || this.isDropdownEmpty;
    },
    isDropdownEmpty() {
      return !this.actions.length;
    }
  },
  methods: {
    triggerAction({ item, command, action }) {
      this.$emit('command', { command, item });
      return typeof action === 'function' ? action(item, command) : '';
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
