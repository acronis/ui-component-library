<script lang="ts" setup>
  import type { RadioOption } from '@/components/__dev__/GoRadio/radio.ts';
  import type { RuleExpression } from '@/composables/index.ts';
  import GoRadioGroupControl from '@/components/__dev__/GoFormFields/GoRadioGroupControl.vue';

  withDefaults(
    defineProps<{
      name: string
      rules?: RuleExpression<RadioOption>
      error?: boolean
      wide?: boolean
    }>(),
    {
      error: true,
    },
  );
</script>

<template>
  <GoRadioGroupControl
    :name="name"
    :rules="rules"
    :error="error"
    :wide="wide"
    inline
  >
    <slot />
  </GoRadioGroupControl>
</template>

<style scoped></style>
