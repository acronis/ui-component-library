import type { PopperPlacement } from '@/components/index.ts';
import type { DirectiveBinding } from 'vue';
import { useDirectiveComponent } from '@/composables/useDirectiveComponent.ts';
import AcvLoading from '@/widgets/loading/loading.vue';

export interface LoadingDirectiveBinding extends Omit<DirectiveBinding<string>, 'arg' | 'value'> {
  arg?: { [T in PopperPlacement]: T extends `${infer A} ${infer B}` ? `${A}-${B}` : T }[PopperPlacement]
  value: boolean | string | Record<string, any>
}

export const vLoading = useDirectiveComponent<LoadingDirectiveBinding>(
  AcvLoading,
  (binding, _el) => {
    return {
      modelValue: typeof binding.value === 'boolean' ? binding.value : true,
      fullscreen: (binding.modifiers.fullscreen && 'fullscreen')
    };
  }
);

export default vLoading;
