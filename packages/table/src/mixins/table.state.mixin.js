import jsonParseSafe from 'packages/table/src/utils/jsonParseSafe';
import { merge, pick } from 'lodash-es';
import { SAVED_COLUMN_PROPS } from 'packages/table/src/table-constants';

export default {
  async mounted() {
    await this.$nextTick();
    this.applySettings();
  },
  methods: {
    updateColumnState({ column, field, value, sorting }) {
      if (column) {
        column[field] && this.$set(column, field, value);

        const stateToSave = {
          columns: {
            [column.columnKey]: pick(column, SAVED_COLUMN_PROPS)
          },
          ...(sorting && {
            sorting: {
              prop: sorting.prop,
              order: sorting.order
            }
          })
        };

        this.saveLocalState(stateToSave);
      }
    },

    saveLocalState(settings) {
      if (!this.id) return;

      const tableId = `table_state_${this.id}`;
      const userSettings = jsonParseSafe(window.localStorage.getItem(tableId));

      localStorage.setItem(tableId, JSON.stringify(merge(userSettings, settings)));
    },

    applySettings() {
      const savedColumns = jsonParseSafe(localStorage.getItem(`table_state_${this.id}`))?.columns;

      savedColumns && Object.keys(savedColumns).forEach((columnKey) => {
        const updatingColumn = this.columns.find((col) => col.columnKey === columnKey);
        const pickedColumnProps = pick(savedColumns[columnKey], SAVED_COLUMN_PROPS);

        Object.keys(pickedColumnProps).forEach((key) => {
          this.$set(updatingColumn, key, pickedColumnProps[key]);
        });
      });
    }
  }
};
