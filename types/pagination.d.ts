import { UIKitComponent } from './component'

/** Pagination Component */
export declare class ElPagination extends UIKitComponent {
  /** Item count of each page */
  pageSize: number

  /** Total item count */
  total: number

  /** Total page count. Set either total or page-count and pages will be displayed; if you need page-sizes, total is required */
  pageCount: number

  /** Current page number */
  currentPage: number

  /** Custom class name for the page size Select's dropdown */
  popperClass: string
}
