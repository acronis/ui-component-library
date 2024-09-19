<script lang="ts" setup>
  import type { RuleExpression } from '@/composables';
  import { useGoField } from '@/composables';
  import type { RadioOption } from '@/components/GoRadio/radio.ts';
  import GoFormControl from '@/components/GoForm/GoFormControl.vue';
  import GoRadioGroup from '@/components/GoRadio/GoRadioGroup.vue';

  const props = withDefaults(
    defineProps<{
      name: string
      rules?: RuleExpression
      error?: boolean
      inline?: boolean
      wide?: boolean
    }>(),
    {
      error: true,
    },
  );

  const { value, handleChange, handleBlur, errorMessage } = useGoField<RadioOption>(
    props.name,
    props.rules,
  );
</script>

<template>
  <GoFormControl
    :error-message="errorMessage"
    :error="error"
  >
    <GoRadioGroup
      :name="name"
      :model-value="value"
      :inline="inline"
      :wide="wide"
      @update:model-value="handleChange"
      @blur="handleBlur"
    >
      <slot />
    </GoRadioGroup>
    <template
      v-if="$slots.informer"
      #informer
    >
      <slot name="informer" />
    </template>
  </GoFormControl>
</template>

<style scoped></style>
