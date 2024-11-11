<script lang="ts" setup>
  import type { GoRangeInputControlProps } from '@/components/__dev__/GoInput/rangeInput.ts';
  import GoFormControl from '@/components/__dev__/GoForm/GoFormControl.vue';
  import GoRangeInput from '@/components/__dev__/GoInput/GoRangeInput.vue';
  import { useGoField } from '@/composables/index.ts';
  import { getUniqueIndex } from '@acronis-platform/utils';
  import { computed } from 'vue';

  const props = withDefaults(defineProps<GoRangeInputControlProps>(), {
    rules: '',
  });

  const uniqueId = computed(() => `input_${getUniqueIndex()}`);
  const { errorMessage, value, handleChange, handleBlur } = useGoField<number | undefined>(
    props.name,
    props.rules,
  );
</script>

<template>
  <GoFormControl
    class="go-range-input"
    :error="false"
    :label="label"
    :label-for="uniqueId"
    :error-message="errorMessage"
  >
    <GoRangeInput
      :model-value="value"
      :max="max"
      :min="min"
      :step="step"
      :name="name"
      :label="label"
      :unique-id="uniqueId"
      :number-format-options="numberFormatOptions"
      @update:model-value="handleChange"
      @blur="handleBlur"
    />
    <template
      v-if="$slots.informer"
      #informer
    >
      <slot name="informer" />
    </template>
  </GoFormControl>
</template>

<style scoped>
  .go-range-input + .go-range-input {
    padding-block-start: 12px;
  }
</style>
