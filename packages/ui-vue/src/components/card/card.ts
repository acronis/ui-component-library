type ShadowVariant = 'regular' | 'modal';
type BorderVariant = 'secondary' | 'active';

export interface AcvCardProps {
  // Layer props
  /**
   * Whether the card should have a shadow
   */
  shadow?: ShadowVariant
  border?: BorderVariant
  withPadding?: boolean
}

export interface AcvCardSlots {
  /**
   * The default slot content
   */
  default: () => null
}
