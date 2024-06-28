import type { LayoutProp } from './grid.ts';

const numberRE = /^\d+$/;

export type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const breakPoints = Object.freeze<BreakPoint[]>(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']);

export function parseAutoLayout(value: LayoutProp) {
  if (typeof value === 'number') {
    return `${value}fr`;
  }

  if (typeof value === 'string') {
    return numberRE.test(value.trim()) ? `repeat(${value}, 1fr)` : value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'number') {
          return `${item}fr`;
        }

        if (typeof item === 'string') {
          return numberRE.test(item.trim()) ? `${item}fr` : item;
        }

        return item;
      })
      .join(' ');
  }

  return value;
}

export function parseSizeLayout(value: LayoutProp) {
  if (typeof value === 'number') {
    return `repeat(${value}, 1fr)`;
  }

  if (typeof value === 'string') {
    return numberRE.test(value.trim()) ? `repeat(${value}, 1fr)` : value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'number') {
          return `${item}fr`;
        }

        if (typeof item === 'string') {
          return numberRE.test(item.trim()) ? `${item}fr` : item;
        }

        return item;
      })
      .join(' ');
  }

  return value;
}
