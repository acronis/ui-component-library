<script setup lang="ts">
  import { computed, toRefs } from 'vue';
  import './markupTable.css';
  import { useResizingColumns } from './composables/useResizingColumns.ts';
  import { useGridColumns } from './composables/useGridColumns.ts';
  import type { MarkupTableColumn, MarkupTableProps } from './markupTable.ts';

  defineOptions({ name: 'MarkupTable' });

  const props = withDefaults(defineProps<MarkupTableProps>(), {
    bordered: true
  });

  const tableClasses = computed(() => ({
    'acv-table': true,
    'acv-markup-table': true,
    'dense': props.dense,
    'bordered': props.bordered,
  }));

  const { columns } = toRefs(props);

  // Feature: grid columns
  const { gridColumns, calcGridColumns } = useGridColumns(columns);

  // Feature: Resize columns
  const { isResizing, onResize } = useResizingColumns(columns, calcGridColumns);

  function getColumnClasses(column: MarkupTableColumn) {
    return {
      'fixed-left': column.fixed,
    };
  }

  const tableHeight = props.height ? `${props.height}px` : '100%';
</script>

<script lang="ts">
  /**
   * @description The Markup Table is a wrap a native <table> in order to make it look like a
   * UIKit Design table.
   * @displayName Markup Table
   */
  export default {
    name: 'MarkupTable',
  };
</script>

<template>
  <div
    class="wrapper"
  >
    <table
      :class="tableClasses"
    >
      <slot>
        <caption>
          <slot name="caption">
            Students list
          </slot>
        </caption>
        <thead :class="{ 'header--being-resized': isResizing }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="getColumnClasses(column)"
            >
              <slot
                :name="`header_${column.key}`"
              >
                {{ column.title }}
              </slot>
              <span
                v-if="column.resizable"
                class="resize-handle"
                @mousedown="onResize($event, column.key)"
              ></span>
            </th>
          </tr>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="getColumnClasses(column)"
            >
              Filter
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in data"
            :key="row.id"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="getColumnClasses(column)"
            >
              <slot
                :name="`column_${column.key}`"
                v-bind="{ row }"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </slot>
    </table>
  </div>
</template>

<style scoped>
@layer components {
  .acv-table {
    thead {
      color: var(--acv-table-color-head);
      background-color: var(--acv-table-bg-head);
      position: sticky;
      top: 0;
      z-index: var(--acv-table-z-index-header);

      th {
        padding: var(--acv-table-cell-padding);
        text-align: start;
      }
    }

    th {
      text-align: left;
    }

    th:last-child {
      border: 0;
    }

    td, th {
      display: block;
      padding: var(--acv-table-padding);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    caption {
      grid-column: 1 / -1;
      font-size: var(--acv-font-size-18);
      text-align: left;
      margin: 24px 0;
    }

    td[cellspan="2"] {
      grid-column: span 2;
    }

    td[cellspan="3"] {
      grid-column: span 3;
    }

    tbody > tr:hover {
      background-color: var(--acv-table-color-hover);
    }

    tr > th:first-of-type {
      text-align: center;
    }

    thead,
    tbody,
    tr {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
    }

    tbody tr,
    thead tr
    {
      height: var(--acv-table-row-height);
      line-height: var(--acv-table-row-height);
    }

    tbody td {
      padding: var(--acv-table-cell-padding);
      text-align: start;
      border-bottom: 1px solid var(--acv-table-border-color)
    }

    &.bordered {
      border: 1px solid var(--acv-table-border-color);
    }

    &.dense {
      --acv-table-cell-padding: var(--acv-table-cell-padding-dense);
      --acv-table-row-height: var(--acv-table-row-height-dense);
    }
  }
}
</style>

<style scoped>
  .wrapper {
    overflow: scroll;
    height: v-bind(tableHeight);
  }

  .acv-markup-table {
    background: var(--acv-table-background-color);
    border-block-end: var(--acv-table-bottom-border);
  }

  .acv-table {
    display: grid;
    min-width: 100%;
    grid-template-columns: v-bind(gridColumns);
    font-size: var(--acv-font-size-body);
  }

  .nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Fixed columns */

  thead.fixed-left {
    z-index: var(--acv-table-z-index-header-fixed);
  }

  .fixed-left {
    position: sticky;
    left: 0;
    background-color: hsl(187deg, 100%, 40%);
  }

  .fixed-right {
    border-left: 1px solid hsl(0deg, 0%, 50%);
    border-right: none;
    position: sticky;
    right: 0;
  }

  /* user styles */

  table thead {
    color: hsl(0deg, 0%, 100%);
    background-color: hsl(120deg, 100%, 25%);
    border-radius: 5px 5px 0 0;
  }

  table th {
    text-align: left;
  }

  table tbody {
    border: 1px solid hsl(120deg, 100%, 25%);
    border-bottom: 3px solid hsl(120deg, 100%, 25%);
  }

  table tbody tr:nth-child(even) {
    background-color: hsl(0deg, 0%, 90%);
  }

  table .unknown {
    color: hsl(0deg, 100%, 50%);
    text-align: left;
  }

  /* Resize columns */

  .resize-handle {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: hsl(240deg, 100%, 27%);
    opacity: 0;
    width: 4px;
    cursor: col-resize;
  }

  .resize-handle:hover,
    /* The following selector is needed so the handle is visible during resize even if the mouse isn't over the handle anymore */
  .header--being-resized .resize-handle {
    opacity: 0.5;
  }

  th:hover .resize-handle {
    opacity: 0.3;
  }
</style>
