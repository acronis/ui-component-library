import type { Ref } from 'vue';
import type { AcvMarkupTableColumn } from '../markupTable.ts';
import { isNumber } from 'lodash-es';
import { onMounted, ref } from 'vue';
import { TABLE_MIN_WIDTH } from '../constants.ts';

export function useGridColumns(columns: Ref<AcvMarkupTableColumn[] | undefined>) {
  const gridColumns = ref('repeat(auto-fit, minmax(250px, 1fr))');

  onMounted(() => {
    calcGridColumns();
  });

  function calcGridColumns() {
    if (!columns?.value) {
      return;
    }

    gridColumns.value = columns.value.map((column) => {
      if (isNumber(column.width)) {
        return `${column.width}px`;
      }

      if (column.maxWidth) {
        return `minmax(max-content, ${column.maxWidth}px)`;
      }

      if (column.width === 'auto') {
        return 'max-content';
      }

      return `minmax(${TABLE_MIN_WIDTH}px, 1fr)`;
    }).join(' ');
  }

  return {
    gridColumns,
    calcGridColumns
  };
}
