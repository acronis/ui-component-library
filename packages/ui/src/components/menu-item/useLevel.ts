import { computed, inject, provide, ref, toValue, watchEffect } from 'vue';
import type { InjectionKey, Ref } from 'vue';

type AcvLevelInjection = Ref<number>;

export const LEVEL_KEY: InjectionKey<AcvLevelInjection> = Symbol('LEVEL_KEY');
const MENU_INDENT = 40;
const MENU_ITEM_INDENT = 16;
export function useLevel(increaseLevel = true) {
  const parentLevel: AcvLevelInjection = inject(LEVEL_KEY, ref(0));
  const level = ref(0);
  const setLevel = (value: number) => {
    level.value = value;
  };

  const indent = computed(() => {
    const value = parentLevel?.value || 0;
    return value === 1
      ? `${MENU_ITEM_INDENT}px`
      : `${(value - 1) * MENU_INDENT + MENU_ITEM_INDENT}px`;
  });

  provide(LEVEL_KEY, level);

  watchEffect(() => {
    if (increaseLevel) {
      level.value = parentLevel ? toValue(parentLevel) + 1 : 0;
    }
  });

  return {
    level,
    indent,
    setLevel
  };
}
