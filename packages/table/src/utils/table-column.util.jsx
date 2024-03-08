import { COLUMN_MIN_WIDTH, COLUMN_TYPES } from 'packages/table/src/table-constants';
import { getPropByPath } from '@/utils/util';

let columnIdSeed = 1;

export const getCellValue = ({ row, column, $index }) => {
  const { prop } = column;

  let value = prop && getPropByPath(row, prop).v;
  if (column?.formatter) {
    value = column.formatter(row, column, value, $index);
  }
  return value;
};

export const getColumnId = (parentId) => `${parentId ? `${parentId}_` : ''}column_${columnIdSeed++}`;

export function getDefaultColumn(options) {
  const columnProps = {};
  Object.keys(options)
    .filter((key) => options[key] !== undefined)
    .forEach((key) => {
      columnProps[key] = options[key];
    });

  const {
    width, minWidth, type, fixed
  } = columnProps;
  return {
    order: '',
    isLastColumn: false,
    isFirstColumn: false,
    isLastScrollableColumn: false,
    isFirstScrollableColumn: false,
    isLastFixedColumn: false,
    isFirstFixedColumn: false,
    isLastFixedRightColumn: false,
    isFirstFixedRightColumn: false,
    ...(type === COLUMN_TYPES.SELECTION && {
      // resizable: false It's host hotfix for beta (ADP-5122)
      alignHeader: 'center',
      sortable: false
    }),
    ...(type === COLUMN_TYPES.INDEX && !width && { width: COLUMN_MIN_WIDTH }),
    ...(type === COLUMN_TYPES.INDEX && !minWidth && { minWidth: COLUMN_MIN_WIDTH }),
    ...(type === COLUMN_TYPES.ACTIONS && !fixed && { fixed: 'right' }),
    ...columnProps,
    realWidth: width || minWidth,
    ...(type === COLUMN_TYPES.INDEX && {
      renderHeader(h, { column }) {
        return column.label || '#';
      },
      renderCell(h, { $index, column }) {
        let i = $index + 1;
        const { index } = column;

        if (typeof index === 'number') {
          i = $index + index;
        } else if (typeof index === 'function') {
          i = index($index);
        }

        return <div>{i}</div>;
      },
      sortable: false,
      align: 'center',
      alignHeader: 'center'
    })
  };
}

export const createColumn = ({
  align,
  autoWidth,
  border,
  borderPosition,
  className,
  columnKey,
  disableOverflow,
  fixed,
  filterMethod,
  formatter,
  headerAlign,
  hideCellContent,
  hidden,
  id,
  index,
  isSubColumn,
  label,
  labelClassName,
  minWidth,
  name,
  prop,
  parentColumnConfig, // TODO support parents in cols table property
  renderBody,
  renderCell,
  renderHeader,
  reserveSelection,
  defaultSelectAll,
  clickable,
  resizable,
  slotName,
  slots,
  selectable,
  searchable,
  showExpand,
  showHint,
  showOverflowTooltip,
  showSelection,
  showTree,
  sortable,
  sortBy,
  sortMethod,
  type,
  width
}, tableId) => {
  const columnId = id || getColumnId(tableId);

  return getDefaultColumn({
    align,
    autoWidth,
    border,
    borderPosition,
    className,
    clickable,
    columnKey: columnKey || name || prop || columnId,
    defaultSelectAll,
    disableOverflow,
    fixed: fixed === '' ? true : fixed,
    filterMethod,
    formatter,
    headerAlign,
    hideCellContent,
    hidden,
    id: columnId,
    index,
    isColumnGroup: false,
    isSubColumn,
    label,
    labelClassName,
    minWidth: minWidth > width ? width : minWidth,
    name,
    parentColumnConfig,
    prop,
    renderBody,
    renderCell,
    renderHeader,
    reserveSelection,
    resizable,
    slotName,
    slots,
    searchable,
    selectable,
    showExpand,
    showHint,
    showOverflowTooltip,
    showSelection,
    showTree,
    sortable: sortable === '' ? true : sortable,
    sortBy,
    sortMethod,
    type,
    width
  });
};

export default createColumn;
