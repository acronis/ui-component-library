import { UIKitComponent } from './component'

/** TableRowsGroup Component */
export declare class ElTableRowsGroup extends UIKitComponent {
  /** Whether to show rows-group header row when this is no data in current rows-group */
  alwaysShown: boolean

  /** Background color */
  backgroundColor: string

  /** Set disabled state for the collapse/expand button */
  collapseButtonDisabled: boolean

  /** Whether the rows group is collapsed */
  collapsed: boolean

  /** Show loading row in the rows-group */
  collapseLoading: boolean

  /** Customization of the text for the loading row */
  collapseLoadingText: string

  /** Whether the rows group is collapsible */
  collapsible: boolean

  /** Custom grouping method */
  customGroupMethod: (row: object) => boolean

  /** Row group header data method */
  getRowGroupData: (row: object, groupId: object) => object

  /** The data key to be grouped by */
  groupKey: string

  /** The data value to be grouped by */
  groupValue: any

  /** Optional custom row group id */
  id: string

  /** direct reference to table component */
  owner: string

  /** Whether selection boxes are visible in row groups */
  rowGroupItemsAreSelectable: boolean

  /** slot name used in row groups header */
  slotName: string
}
