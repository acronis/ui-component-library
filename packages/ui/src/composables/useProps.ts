import type { PropType } from 'vue';
import { inject } from 'vue';
import { PROPS_PLUGIN_INJECTION_KEY } from '../plugins/propsPlugin.ts';
import type { ColorProp } from '@/types/props.ts';

/*
 * This function is used to define props for a component.
 * TODO: remove this function and use the `useDefaults` composable instead.
 */
export function useProps<T extends Record<string, any>>(componentName: string, componentsProps: T) {
  const injectedDefaultProps = inject(PROPS_PLUGIN_INJECTION_KEY, { props: {} });
  const props = {
    ...injectedDefaultProps.props[componentName],
    ...componentsProps
  };

  return {
    props
  };
}

export const color = {
  type: [String, undefined] as PropType<ColorProp>,
} as const;
