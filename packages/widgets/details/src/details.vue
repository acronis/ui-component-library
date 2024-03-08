<template>
  <div
    class="el-details"
    :class="{
      'is-open': open
    }"
  >
    <div class="el-details__panel">
      <div
        v-if="$slots['header']"
        class="el-details__panel-header"
      >
        <slot name="header" />
      </div>
      <div
        v-if="$slots['toolbar']"
        class="el-details__panel-toolbar"
      >
        <slot name="toolbar" />
      </div>
      <div class="el-details__panel-table">
        <slot name="table" />
      </div>
    </div>
    <div
      v-if="open"
      class="el-details__details"
    >
      <slot name="details" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ElDetails',

    props: {
      mode: {
        type: String,
        default: 'single',
        validator: (value) => ['single', 'multi', 'hybrid'].includes(value)
      },
      open: {
        type: Boolean,
        default: false
      }
    },

    provide() {
      return {
        details: this
      };
    },

    computed: {
      isSingle() {
        return this.mode === 'single';
      },

      isMulti() {
        return this.mode === 'multi';
      },

      isHybrid() {
        return this.mode === 'hybrid';
      },

      showSelectionColumn() {
        return this.isMulti || this.isHybrid;
      },

      highlightCurrentRow() {
        return this.isSingle;
      }
    },

    methods: {
      onCurrentChange(currentRow) {
        if (this.isSingle || this.isHybrid) {
          this.change(currentRow ? [currentRow] : []);
        }
      },

      onSelectionChange(selection, current) {
        if (selection.length) {
          if (this.isHybrid || this.isMulti) {
            if (selection.length === 1) {
              this.$emit('clear-current-row');
              this.change(selection);
            } else {
              this.close();
            }
          }
        }

        if (selection.length === 0) {
          if (this.isHybrid) {
            // AUK-4223 Do not close details on changing selection while current row is set
            !current && this.close();
          }
        }
      },

      change(detailsData) {
        this.$emit('change', detailsData);
      },

      close() {
        this.$emit('change', []);
      }
    }
  };
</script>
