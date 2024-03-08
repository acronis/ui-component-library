<template>
  <el-table-column
    v-bind="$attrs"
    ref="column"
    class="el-table__actions-column"
    label-class-name="is-actions-column"
    class-name="is-actions-column"
    :width="width"
    :min-width="width"
    :align="align"
    :fixed="fixed"
    :border="showBorder"
    :border-position="borderPosition"
    :clickable="isClickable"
    :prop="randomId"
    :type="COLUMN_TYPES.ACTIONS"
  >
    <template #header="props">
      <slot
        name="header"
        v-bind="props"
      >
        <el-dropdown
          v-if="showColumnsSelector"
          ref="headerDropdown"
          flyweight
          placement="bottom-end"
          trigger="click"
          :disabled="disableColumnsSelector"
        >
          <el-button
            :disabled="disableColumnsSelector"
            type="ghost"
            :icon="headerIcon"
          />
          <template #dropdown>
            <el-dropdown-menu
              class="el-table__columns-selector"
            >
              <el-checkbox
                v-for="column in dataColumns"
                :key="column.columnKey"
                class="el-table__columns-selector-option"
                :checked="columnsRenderStatus[column.columnKey]"
                :disabled="columnsRenderStatus[column.columnKey] && renderedColumnKeys.length === 2"
                @change="changeColumnVisibility(column, !column.hidden)"
              >
                {{ column.label }}
              </el-checkbox>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </slot>
    </template>
    <template #default="props">
      <slot v-bind="props">
        <el-dropdown
          flyweight
          placement="bottom-end"
          @click.stop
          @command="$emit('command', $event, props.row)"
        >
          <el-button
            type="ghost"
            :icon="actionIcon"
            :disabled="disabled"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-table-action-item
                v-for="action in actions"
                :key="action.label"
                :action="action"
                :item="props.row"
              />
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </slot>
    </template>
  </el-table-column>
</template>

<script>
  import ElDropdown from 'packages/dropdown';
  import ElDropdownMenu from 'packages/dropdown-menu';
  import ElCheckbox from 'packages/checkbox';
  import ElTableActionItem from 'packages/table/src/table-action-item.vue';
  import ElButton from 'packages/button';
  import { COLUMN_ICON_WIDTH, COLUMN_TYPES } from 'packages/table/src/table-constants';
  import ElTableColumn from './table-column';

  export default {
  name: 'ElTableActionsColumn',

  components: {
    ElTableColumn,
    ElDropdown,
    ElDropdownMenu,
    ElCheckbox,
    ElButton,
    ElTableActionItem
  },

  props: {
    clickable: {
      type: Boolean,
      default: false
    },

    headerIcon: {
      type: String,
      default: 'i-cog--16'
    },

    actionIcon: {
      type: String,
      default: 'i-ellipsis-h--16'
    },

    showColumnsSelector: {
      type: Boolean,
      default: true
    },

    disableColumnsSelector: {
      type: Boolean,
      default: false
    },

    selectableColumnsFilter: {
      type: Function,
      default: () => true
    },

    actions: {
      type: Array,
      default: () => []
    },

    hideOnRowSelection: {
      type: Boolean,
      default: true
    },

    // TODO support columnId to hide columns
    initialHiddenColumns: {
      type: Array,
      default: () => []
    },

    border: {
      type: Boolean,
      default: false
    },

    borderPosition: {
      type: String,
      default: 'left'
    },

    width: {
      type: [String, Number],
      default: COLUMN_ICON_WIDTH
    },

    align: {
      type: String,
      default: 'center'
    },

    fixed: {
      type: String,
      default: 'right'
    }
  },

  emits: ['command', 'column-visible-change'],

  data() {
    return {
      COLUMN_TYPES,
      disabled: false,
      hasRowSelection: false,
      columnsRenderStatus: {},
      dataColumns: [],
      renderedColumnKeys: []
    };
  },

  computed: {
    isClickable() {
      return !this.disabled && (this.showColumnsSelector && !this.disableColumnsSelector) && this.clickable;
    },
    showBorder() {
      return !this.disabled && this.border;
    }
  },
  watch: {
    // TODO do not render initially hidden columns in Table component
    initialHiddenColumns: {
      immediate: true,
      async handler(hiddenColumns) {
        await this.$nextTick();
        this.owner && hiddenColumns?.forEach((columnProp) => this.owner.changeColumnVisibility(columnProp, true));
      }
    }
  },

  created() {
    // Need a random prop for el-table-column.
    // Otherwise it will rerender itself everytime dropdown is clicked.
    this.randomId = Math.random().toString(36).substring(3);
  },

  mounted() {
    this.owner = this.$refs.column.owner;

    this._updateSelectionState = () => {
      this.hasRowSelection = this.owner.selection.length > 0;
    };

    this._updateColumnsState = () => {
      this.renderedColumnKeys = this.owner.visibleColumns.map((c) => c.columnKey);

      this.dataColumns = this.owner.columns
        .filter((column) => column.prop && column.prop !== this.randomId)
        .filter((c) => !c.default)
        .filter((column) => column.columnKey && column.type !== COLUMN_TYPES.ACTIONS)
        .filter(this.owner.selectableColumnsFilter)
        .filter(this.selectableColumnsFilter);

      this.columnsRenderStatus = this.dataColumns.reduce((acc, cur) => ({
        ...acc,
        [cur.columnKey]: this.renderedColumnKeys.indexOf(cur.columnKey) !== -1
      }), {});
    };

    this._updateSelectionState();
    this._updateColumnsState();
    this.$watch('owner.selection', this._updateSelectionState);
    this.$watch('owner.columns', this._updateColumnsState);
    this.$watch('owner.visibleColumns', this._updateColumnsState);

    if (this.$attrs.hidden !== undefined) {
      this.$watch('$attrs.hidden', function (newHidden) {
        this.disabled = newHidden;
      }, { immediate: true });
    } else {
      this.$watch('hasRowSelection', function (newHasRowSelection) {
        if (this.hideOnRowSelection) {
          this.disabled = newHasRowSelection;
        }
      }, { immediate: true });
    }
  },
  methods: {
    changeColumnVisibility(column, isHidden) {
      this.owner.changeColumnVisibility(column.columnKey, isHidden);

      this.$emit('column-visible-change', column, !isHidden);
    }
  }
};
</script>
