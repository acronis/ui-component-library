<script lang="ts" setup>
  import type { CheckboxModel } from '@/components/__dev__/GoCheckbox/checkbox.ts';
  import GoCheckbox from '@/components/__dev__/GoCheckbox/GoCheckbox.vue';
  import GoFormControl from '@/components/__dev__/GoForm/GoFormControl.vue';
  import { useGoField } from '@/composables/index.ts';

  const props = defineProps<{
    name: string
    rules?: string
    label?: string
    disabled?: boolean
  }>();

  const { value, handleChange, handleBlur, errorMessage } = useGoField<CheckboxModel>(
    props.name,
    props.rules,
  );
</script>

<template>
  <GoFormControl :error-message="errorMessage">
    <GoCheckbox
      class="control"
      :name="name"
      :disabled="disabled"
      :model-value="value"
      v-bind="$attrs"
      @update:model-value="handleChange"
      @blur="handleBlur"
    >
      <template v-if="label">
        {{ label }}
      </template>
      <slot v-else />
    </GoCheckbox>
    <template
      v-if="$slots.informer"
      #informer
    >
      <slot name="informer" />
    </template>
  </GoFormControl>
</template>

<style scoped>
  .control {
    align-self: flex-start;
  }
</style>
