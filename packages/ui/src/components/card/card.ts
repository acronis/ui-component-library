import type { AcvLayerProps } from '@/composables/useLayer.ts';

export interface AcvCardProps extends AcvLayerProps {
  // Layer props
  /**
   * Whether the card should have a shadow
   */
  shadow?: boolean
  round?: boolean
  border?: boolean
  padding?: boolean

  /**
   * Render image at the top of the card (_above header_)
   */
  img?: string

  /**
   * `alt` attribute for image rendered via `img` prop
   */
  imgAlt?: string

  /**
   * Set loading state
   */
  loading?: boolean
}

export interface AcvCardSlots {
  /**
   * The default slot content
   */
  default: () => null

  loading: () => null
}
