export interface AcvCarouselProps {
  /**
   * Number of carousel items
   */
  count: number
  cycle?: boolean
}

export interface AcvCarouselEvents {
}

export interface AcvCarouselSlots {
  prev: (props: {
    prev: () => void
    disabled: boolean
  }) => void
  next: (props: {
    next: () => void
    disabled: boolean
  }) => void
}
