// Components
import type { DirectiveBinding } from 'vue';

// Composable
import { useDirectiveComponent } from '@/composables/useDirectiveComponent.ts';

// Types
import type { PopperPlacement } from '../components/popper/popper.ts';

// Components
import AcvTooltip from '../components/tooltip/tooltip.vue';

export interface TooltipDirectiveBinding extends Omit<DirectiveBinding<string>, 'arg' | 'value'> {
  arg?: { [T in PopperPlacement]: T extends `${infer A} ${infer B}` ? `${A}-${B}` : T }[PopperPlacement]
  value: boolean | string | Record<string, any>
}

/*
 * AcvTooltip directive
 * --------------------
 * Acv Tooltip component is mounted as a directive
 * with reference to the element it is mounted on.
 * @param {TooltipDirectiveBinding} binding - Directive binding object
 * @param {HTMLElement} el - Element the directive is mounted on
 * @returns {Object} - Directive object
 */
export const vTooltip = useDirectiveComponent<TooltipDirectiveBinding>(AcvTooltip, (binding, el) => {
  return {
    referenceEl: el,
    placement: binding.arg?.replace('-', ' ') ?? 'top',
    trigger: (binding.value as { trigger?: 'hover' | 'click' })?.trigger || (binding.modifiers.click && 'click') || 'hover',
    persist: (binding.modifiers.persist && 'persist'),
    content: typeof binding.value === 'boolean' ? undefined : binding.value,
  };
});

export default vTooltip;
