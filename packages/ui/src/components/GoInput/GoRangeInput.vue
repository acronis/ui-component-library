<script setup lang="ts">
  import { computed, ref, toRef, watch } from 'vue';
  import { getUniqueIndex } from '@acronis-platform/utils';
  import type { GoRangeInputProps } from '@/components/GoInput/rangeInput.ts';
  import { getNumberFormatter } from '@/composables/formatNumber.ts';
  import GoRange from '@/components/GoRange/GoRange.vue';
  import GoInputNumber from '@/components/GoInput/GoInputNumber.vue';

  const props = withDefaults(defineProps<GoRangeInputProps>(), {
    min: 0,
    uniqueId: () => `input_${getUniqueIndex()}`,
  });

  const emit = defineEmits<{
    (e: 'update:model-value', value: number | undefined): void
    (e: 'blur', event: FocusEvent): void
  }>();

  const inputValue = ref<number>();
  const format = computed(() => getNumberFormatter(props.numberFormatOptions));

  watch(toRef(props, 'modelValue'), onModelChange, { immediate: true });

  function onModelChange(value: number | undefined) {
    // if value changed from the outside of this component
    if (value !== inputValue.value) {
      inputValue.value = value;
    }
  }

  function setInputValue(value: number | undefined) {
    inputValue.value = value;
    emit('update:model-value', value);
  }
</script>

<template>
  <div class="go-range-input">
    <div>{{ format(min) }}</div>
    <GoRange
      :model-value="inputValue"
      :min="min"
      :max="max"
      :step="step"
      @update:model-value="setInputValue"
      @blur="$emit('blur', $event)"
    />
    <div>{{ format(max) }}</div>
    <GoInputNumber
      :id="uniqueId"
      class="input"
      :model-value="inputValue"
      :min="min"
      :max="max"
      @update:model-value="setInputValue"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<style scoped>
  .go-range-input {
  /*  @mixin text-ui-15; */
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .input {
    inline-size: 25%;
    margin-inline-start: 8px;
  }
</style>
