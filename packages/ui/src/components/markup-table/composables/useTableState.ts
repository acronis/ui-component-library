import { merge, pick } from 'lodash-es';
import { SAVED_COLUMN_PROPS, TABLE_KEY } from '../constants.ts';
import jsonParseSafe from '../utils/jsonParseSafe.js';

export function useTableState(columns) {
  function saveLocalState(settings) {
    const tableId = `table_state_${TABLE_KEY.toString()}`;
    const userSettings = jsonParseSafe(localStorage.getItem(tableId));

    localStorage.setItem(tableId, JSON.stringify(merge(userSettings, settings)));
  }

  function applyState() {
    const savedColumns = jsonParseSafe(localStorage?.getItem(`table_state_${TABLE_KEY.toString()}`))?.columns;

    if (savedColumns) {
      Object.keys(savedColumns).forEach((columnKey) => {
        const updatingColumn = columns.find(col => col.columnKey === columnKey);
        const pickedColumnProps = pick(savedColumns[columnKey], SAVED_COLUMN_PROPS);

        Object.keys(pickedColumnProps).forEach((key) => {
          updatingColumn[key] = pickedColumnProps[key];
        });
      });
    }
  }

  return {
    applyState,
    saveLocalState
  };
}
