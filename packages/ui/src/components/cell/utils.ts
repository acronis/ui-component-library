import { isDefined } from '@vueuse/core';
import type { MaybeRef } from 'vue';

export type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const breakPoints = Object.freeze<BreakPoint[]>(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']);

export function isPositionSet(value: number | string) {
  return value === 0 || (value && value !== 'auto');
}

export function parsePosition(value: number | string) {
  return typeof value === 'number' ? value + 1 : value;
}

export function queryBreakPointOptions(breakPoint: MaybeRef<string | undefined>, props) {
  const index = breakPoints.findIndex(v => v === breakPoint);

  if (~index) {
    for (let i = index; i >= 0; --i) {
      if (isDefined(props[breakPoints[i]])) {
        return props[breakPoints[i]];
      }
    }
  }

  return null;
}
