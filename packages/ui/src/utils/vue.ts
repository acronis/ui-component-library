import { objectKeys } from '@antfu/utils';
import { computed, useSlots } from 'vue';

export const filterUsedSlots = computed(() => <const T extends Record<string, any>>(slotsToUse: T): (keyof T)[] => {
  const slots = useSlots();

  return objectKeys(slotsToUse).filter(key => slots[key as keyof typeof slots]) as (keyof T)[];
});
