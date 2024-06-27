import { isNumber } from '@antfu/utils';
import type { App, InjectionKey, Ref } from 'vue';
import { computed, inject, ref } from 'vue';

import { createGlobalState } from '@vueuse/core';

export const ACV_Z_INDEX = Symbol('ACV_Z_INDEX') as InjectionKey<Ref<number | undefined>>;

const zIndexCounter = ref(0);

export const useZIndex = createGlobalState((defaultBaseZIndex?: number, app?: App) => {
  if (!defaultBaseZIndex || !app) {
    throw new Error('[Anu] `useZIndex` composable must be initialized before usage.');
  }

  let injectedZIndex: Ref<number | undefined> | undefined;

  app.runWithContext(() => {
    injectedZIndex = inject(ACV_Z_INDEX, undefined);
  });

  const baseZIndex = computed(() => {
    const injectedZIndexValue = injectedZIndex?.value;

    return isNumber(injectedZIndexValue)
      ? injectedZIndexValue
      : defaultBaseZIndex;
  });

  const activeZIndex = computed(() => baseZIndex.value + zIndexCounter.value);

  const getNextZIndex = () => {
    zIndexCounter.value++;

    return activeZIndex.value;
  };

  return {
    baseZIndex,
    activeZIndex,
    getNextZIndex,
  };
});
