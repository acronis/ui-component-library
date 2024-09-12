import type PerfectScrollbar from 'perfect-scrollbar';

export interface AcvScrollbarProps {
  /**
   * Tag of the scrollbar
   * @default div
   */
  tag?: string

  /**
   * Options of the scrollbar
   * see [Options](https://perfectscrollbar.com/options.html)
   */
  options?: PerfectScrollbar.Options
}

export type PerfectScrollbarEmitsKeys =
  | 'scroll'
  | 'ps-scroll-y'
  | 'ps-scroll-x'
  | 'ps-scroll-up'
  | 'ps-scroll-down'
  | 'ps-scroll-left'
  | 'ps-scroll-right'
  | 'ps-y-reach-start'
  | 'ps-y-reach-end'
  | 'ps-x-reach-start'
  | 'ps-x-reach-end';

export type AcvScrollbarEmits = {
  [EventName in PerfectScrollbarEmitsKeys]: [value: Event]
};
