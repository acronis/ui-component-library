<script lang="ts" setup>
  import type { CheckboxModel } from '@/components/GoCheckbox/checkbox.ts';
  import GoFormControl from '@/components/GoForm/GoFormControl.vue';
  import GoToggle from '@/components/GoToggle/GoToggle.vue';
  import { useGoField } from '@/composables';

  const props = defineProps<{
    name: string
    rules?: string
    text?: string
    label?: string
    disabled?: boolean
  }>();

  const { value, handleChange, handleBlur, errorMessage } = useGoField<CheckboxModel>(
    props.name,
    props.rules,
  );
</script>

<template>
  <GoFormControl
    :label="label"
    :error-message="errorMessage"
  >
    <GoToggle
      :name="name"
      :disabled="disabled"
      :model-value="value"
      v-bind="$attrs"
      @update:model-value="handleChange"
      @blur="handleBlur"
    >
      <template v-if="text">
        {{ text }}
      </template>
      <slot v-else />
    </GoToggle>
    <template
      v-if="$slots.informer"
      #informer
    >
      <slot name="informer" />
    </template>
  </GoFormControl>
</template>

<style scoped></style>
