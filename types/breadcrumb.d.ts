import { UIKitComponent } from './component'

/** Displays the location of the current page, making it easier to browser back */
export declare class ElBreadcrumb extends UIKitComponent {
  /** Separator character */
  separator: string

  /** Name of the icon separator */
  separatorIcon: string

  /** Maximum items displayed */
  maxItems: number

  /** Whether breadcrumb will be wrapped to multiple line */
  multiLine: boolean
}
