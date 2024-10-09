<script lang="ts" setup>
  import type { RadioOption } from '@/components/GoRadio/radio.ts';
  import type { RuleExpression } from '@/composables';
  import GoRadioGroupControl from '@/components/GoFormFields/GoRadioGroupControl.vue';

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
