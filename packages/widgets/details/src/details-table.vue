<template>
  <el-table
    v-bind="$attrs"
    ref="table"
    v-loading="loading"
    el-loading-size="32"
    :data="data"
    :cols="cols"
    :scroll-horizontal="!detailsOpen"
    :highlight-current-row="getSingleSelectIsEnabled()"
    :multi-selection-mode="getMultiSelectIsEnabled()"
    :row-key="rowKey"
    :show-header="!loading"
    :select-by-row="getMultiSelectIsEnabled()"
    :selection-enabled="!details.isSingle && detailsShowSelectionColumn"

    @current-change="onCurrentChange"
    @selection-change="onSelectionChange"
  >
    <template
      v-for="(_, slot) of $slots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>

    <template
      v-if="loading"
      #empty
    >
      <div />
    </template>
    <template v-if="!loading">
      <slot />
    </template>
  </el-table>
</template>

<script>
  import ElTable from 'packages/table';
  import loading from 'packages/loading/src/directive';
  import eventBus from '@/utils/eventBus';

  export default {
  name: 'ElDetailsTable',

  components: {
    ElTable
  },

  directives: {
    loading
  },

  inject: ['details'],

  props: {
    rowKey: {
      type: [String, Function],
      required: true
    },

    data: {
      type: Array,
      default: () => []
    },

    cols: {
      type: Array
    },

    highlightCurrentRow: {
      type: Boolean,
      default: false
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['current-change', 'selection-change'],

  data() {
    return {
      detailsOpen: false,
      detailsHighlightCurrentRow: this.highlightCurrentRow,
      detailsShowSelectionColumn: false,
      table: null
    };
  },

  watch: {
    detailsOpen(val) {
      const table = this.$refs.table;
      if (val) {
        table.bodyScrollbarWrap.scrollLeft = 0;
      }
    }
  },

  mounted() {
    this.table = this.$refs.table;
    if (this.details) {
      this.$watch('details.open', (open) => {
        this.detailsOpen = open;
        if (!open && this.table) {
          this.table.setCurrentRow(null);
        }
      }, { immediate: true });

      this.$watch('details.showSelectionColumn', (newShowSelectionColumn) => {
        this.detailsShowSelectionColumn = newShowSelectionColumn;
      }, { immediate: true });

      this.$watch('details.highlightCurrentRow', (newHighlightCurrentRow) => {
        this.detailsHighlightCurrentRow = newHighlightCurrentRow;
      }, { immediate: true });

      eventBus.$on('el.details.clear-current-row', () => {
        this.table?.setCurrentRow(null);
      });
      // this.details.$on('clear-current-row', () => {
      //   this.table?.setCurrentRow(null);
      // });
    }
  },

  methods: {
    onCurrentChange(...args) {
      this.details?.onCurrentChange.apply(null, args);

      this.$emit('current-change', args);
    },

    onSelectionChange(...args) {
      const { currentRow } = this.table?.store.states;
      this.details?.onSelectionChange.apply(null, [...args, currentRow]);

      this.$emit('selection-change', args);
    },

    clearSelection(force) {
      this.table?.clearSelection(force);
    },

    setCurrentRow(row) {
      this.table?.setCurrentRow(row);
    },
    getSingleSelectIsEnabled() {
      return this.details.isSingle
          || (this.details.isHybrid && !this.table?.selection.length)
          || this.highlightCurrentRow
          || this.detailsHighlightCurrentRow;
    },
    getMultiSelectIsEnabled() {
      return !this.details.isSingle || this.table?.selection.length > 0;
    }
  }
};
</script>
