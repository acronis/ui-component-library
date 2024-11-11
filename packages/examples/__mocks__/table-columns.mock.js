import { COLUMN_TYPES } from '@/components/table/src/table-constants';

export default [
  {
    prop: 'name',
    label: 'Name',
    minWidth: 150,
    type: 'selection',
    showOverflowTooltip: true,
    sortable: true
  },
  {
    prop: 'status',
    label: 'Status',
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'plan',
    label: 'Plan',
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'message',
    label: 'Message',
    name: 'uniqueMessage',
    showOverflowTooltip: true
  },
  {
    label: 'Action',
    type: COLUMN_TYPES.ACTIONS,
    align: 'center',
    borderLeft: true
  }
];
