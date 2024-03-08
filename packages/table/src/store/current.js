import { getRowIdentity } from '../table-utils';

export default {
  data() {
    return {
      states: {
        // Unresponsive, when setting currentRowKey, data does not necessarily exist,
        // maybe it is impossible to calculate the correct currentRow
        // cache the value, when the user clicks to modify currentRow, reset the value to null
        _currentRowKey: null,
        currentRow: null
      }
    };
  },

  methods: {
    setCurrentRowKey(key) {
      this.table.__assertRowKey();
      this.states._currentRowKey = key;
      this.setCurrentRowByKey(key);
    },

    restoreCurrentRowKey() {
      this.states._currentRowKey = null;
    },

    setCurrentRowByKey(key) {
      const { states } = this;
      const { data = [], rowKey } = states;
      let currentRow = null;
      if (rowKey) {
        currentRow = data.find((item) => getRowIdentity(item, rowKey) === key);
      }
      states.currentRow = currentRow;
    },

    updateCurrentRow(currentRow) {
      const { states, table } = this;
      const oldCurrentRow = states.currentRow;

      if (currentRow && currentRow !== oldCurrentRow) {
        states.currentRow = currentRow;
        table.$emit('current-change', currentRow, oldCurrentRow);
        return;
      }
      if (!currentRow && oldCurrentRow) {
        states.currentRow = null;
        table.$emit('current-change', null, oldCurrentRow);
      }
    },

    updateCurrentRowData() {
      const { states, table } = this;
      const { rowKey, _currentRowKey } = states;
      // When data is null, the default value during destructuring will be ignored
      const data = states.data || [];
      const oldCurrentRow = states.currentRow;

      // Try to update the data when currentRow is not in data
      if (oldCurrentRow && data.indexOf(oldCurrentRow) === -1) {
        if (rowKey) {
          const currentRowKey = getRowIdentity(oldCurrentRow, rowKey);

          this.setCurrentRowByKey(currentRowKey);
        } else {
          states.currentRow = null;
        }
        if (!states.currentRow) {
          table.$emit('current-change', null, oldCurrentRow);
        }
      } else if (_currentRowKey) {
        // Convert the rowKey set initially to rowData
        this.setCurrentRowByKey(_currentRowKey);
        this.restoreCurrentRowKey();
      }
    }
  }
};
