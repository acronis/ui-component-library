import type { Ref } from 'vue';
import { ref } from 'vue';

export const BREAKPOINTS = [
  'xs' as const,
  'sm' as const,
  'md' as const,
  'lg' as const,
  'xl' as const,
  'xxl' as const,
  'fluid' as const,
];

export interface ResponsibleProps {
  /**
   * Set container 100% wide until extra small breakpoint.
   */
  xs?: boolean
  /**
   * Set container 100% wide until small breakpoint.
   */
  sm?: boolean
  /**
   * Set container 100% wide until medium breakpoint.
   */
  md?: boolean
  /**
   * Set container 100% wide until large breakpoint.
   */
  lg?: boolean
  /**
   * Set container 100% wide until X-large breakpoint.
   */
  xl?: boolean
  /**
   * Set container 100% wide until XX-large breakpoint.
   */
  xxl?: boolean
  /**
   * Set container 100% wide, spanning the entire width of the viewport.
   */
  fluid?: boolean
}

export function useBreakpoints(className, props: ResponsibleProps) {
  const responsiveClassNames: Ref<string[]> = ref([]);

  BREAKPOINTS.forEach((bp) => {
    const breakpoint = props[bp];

    breakpoint && responsiveClassNames.value.push(`${className}-${bp}`);
  });

  return {
    responsiveClassNames,
  };
}
