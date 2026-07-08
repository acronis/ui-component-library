/**
 * Chart Color Palette
 *
 * Provides a consistent color palette for charts across the application.
 * Colors are automatically assigned based on index.
 */

export const CHART_COLORS = [
  'var(--ui-chart-1)',
  'var(--ui-chart-2)',
  'var(--ui-chart-3)',
  'var(--ui-chart-4)',
  'var(--ui-chart-5)',
  'var(--ui-chart-6)',
  'var(--ui-chart-7)',
  'var(--ui-chart-8)',
  'var(--ui-chart-9)',
] as const;

export const CHART_COLORS_SEMANTIC = {
  primary: 'var(--ui-chart-1)',
  success: 'var(--ui-chart-success)',
  warning: 'var(--ui-chart-warning)',
  danger: 'var(--ui-chart-danger)',
  info: 'var(--ui-chart-info)',
  critical: 'var(--ui-chart-critical)',
  neutral: 'var(--ui-chart-neutral)',
} as const;

/**
 * Get a color from the palette by index
 * Automatically cycles through colors if index exceeds palette length
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Get multiple colors from the palette
 */
export function getChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getChartColor(i));
}

/**
 * Create data with colors automatically assigned
 * Useful for pie charts and other charts that need color per data point
 */
export function addColorsToData<T extends Record<string, any>>(
  data: T[],
  colorKey: string = 'color',
  startIndex: number = 0
): T[] {
  return data.map((item, index) => ({
    ...item,
    [colorKey]: getChartColor(startIndex + index),
  }));
}
