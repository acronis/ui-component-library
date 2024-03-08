import { UIKitComponent } from './component'
import { VNode } from 'vue'

export interface FileBrowserSlots {
  /** Used to render the contents which when clicked opens the file browser */
  default: VNode[],

  /**  Used to render the contents that appear when the file system is not loaded successfully */
  emptyScreen: VNode[],

  [key: string]: VNode[]
}

/** FileBrowser Component */
export declare class ElFileBrowser extends UIKitComponent {

  /** Add button text */
  addButtonText: string

  /** Default menu index of file browser */
  defaultMenuIndex: string

  /** File system API */
  filesApi: object

  /** Menu items object */
  menuItems: object[]

  /** Search placeholder text */
  searchPlaceholder: string

  /** Toggles display of size */
  size: boolean

  /** Title of the file browser */
  title: string

  $slots: FileBrowserSlots
}
