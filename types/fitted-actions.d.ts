import {UIKitComponent} from "./component";
import {ElTableActionItem} from "./table-action-item";

/** ElFittedActions Component */
export declare class ElTableActionsColumn extends UIKitComponent {
  /** Array of ElTableActionItems for item */
  actions: ElTableActionItem[]

  /** Detailed item or table row data **/
  item: object

  /** Whether to show dropdown with overflowed actions */
  showDropdown: boolean
}
