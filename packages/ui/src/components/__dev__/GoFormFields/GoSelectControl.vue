<script lang="ts" setup>
  import type { SelectModel } from '@/components/__dev__/GoSelect/select.ts';
  import type { RuleExpression } from '@/composables/index.ts';
  import GoFormControl from '@/components/__dev__/GoForm/GoFormControl.vue';
  import GoSelect from '@/components/__dev__/GoSelect/GoSelect.vue';
  import { useGoField } from '@/composables/index.ts';

  const props = defineProps<{
    name: string
    rules?: RuleExpression<SelectModel>
    label?: string
    disabled?: boolean
    multiple?: boolean
    resettable?: boolean
  }>();

  const { value, handleChange, handleBlur, errorMessage } = useGoField<SelectModel>(
    props.name,
    props.rules,
  );
</script>

<template>
  <GoFormControl
    :label="label"
    :error-message="errorMessage"
  >
    <GoSelect
      :error="!!errorMessage"
      :disabled="disabled"
      :model-value="value"
      :multiple="multiple"
      :resettable="resettable"
      v-bind="$attrs"
      @update:model-value="handleChange"
      @touch="handleBlur"
    >
      <slot />
    </GoSelect>
    <template
      v-if="$slots.informer"
      #informer
    >
      <slot name="informer" />
    </template>
  </GoFormControl>
</template>

<style scoped></style>
