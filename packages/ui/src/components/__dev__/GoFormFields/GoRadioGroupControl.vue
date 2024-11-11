<script lang="ts" setup>
  import type { RadioOption } from '@/components/__dev__/GoRadio/radio.ts';
  import type { RuleExpression } from '@/composables/index.ts';
  import GoFormControl from '@/components/__dev__/GoForm/GoFormControl.vue';
  import GoRadioGroup from '@/components/__dev__/GoRadio/GoRadioGroup.vue';
  import { useGoField } from '@/composables/index.ts';

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
