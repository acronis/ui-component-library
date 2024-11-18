<script lang="ts" setup>
  import type { RadioOption } from '@/components/__dev__/GoRadio/radio.ts';
  import { provideRadioGroup } from '@/components/__dev__/GoRadio/radio.ts';
  import { getUniqueIndex } from '@acronis-platform/utils';

  const props = withDefaults(
    defineProps<{
      modelValue?: RadioOption
      name?: string
      disabled?: boolean
      inline?: boolean
      wide?: boolean
    }>(),
    {
      name: () => `radio-group-${getUniqueIndex()}`,
    },
  );
  const emit = defineEmits<{
    (e: 'update:model-value', value: RadioOption): void
    (e: 'blur', event: FocusEvent): void
  }>();
  provideRadioGroup(props, emit);
</script>

<template>
  <div
    class="go-radio-group"
    :class="inline && 'go-radio-group_inline'"
  >
    <slot />
  </div>
</template>

<style scoped>
  .go-radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--go-radio-group-gap, 0);
  }

  .go-radio-group_inline {
    flex-direction: row;
  }
</style>
