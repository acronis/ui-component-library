<script lang="ts" setup>
  import type { SelectModel, SelectOptionValue, SelectProps } from './select';
  import { useProxyVisible } from '@/composables/useProxyVisible.ts';
  import { computed } from 'vue';
  import { provideSelect } from './select';

  const props = withDefaults(defineProps<SelectProps>(), {
    visible: undefined,
    placeholder: 'Select...',
  });
  const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void
    (e: 'update:model-value', value: SelectModel): void
    (e: 'touch'): void
    (e: 'input'): void
  }>();
  const multiple = computed(() => props.multiple);
  const multipleValues = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []));
  const { proxyVisible } = useProxyVisible(props, emit);

  provideSelect({ multiple, onSelect, isSelected });

  function onSelect(value: SelectOptionValue) {
    emit('input');

    if (!props.multiple) {
      emit('update:model-value', value);
      proxyVisible.value = false;
    }
    else {
      emit('update:model-value', getToggledValues(value));
    }
  }

  // function onReset() {
  //   emit('input');
  //   emit('update:model-value', props.multiple ? [] : null);
  // }

  function getToggledValues(value: SelectOptionValue) {
    const values = new Set(multipleValues.value);

    if (isSelected(value)) {
      values.delete(value);
    }
    else {
      values.add(value);
    }

    return Array.from(values);
  }

  function isSelected(value: SelectOptionValue) {
    return props.multiple ? multipleValues.value.includes(value) : props.modelValue === value;
  }

  // TODO: generalize logic from GoInputAutocomplete.vue about up/down keys and use here, ROL-4042
</script>

<template>
  <div class="go-select">
    <!--    TODO: refactor it -->
    <!--    <AcvPopover -->
    <!--      v-model:visible="proxyVisible" -->
    <!--      :position="position" -->
    <!--      block -->
    <!--      keep-alive -->
    <!--      @closed="$emit('touch')" -->
    <!--    > -->
    <!--      <template #handle="{ toggle }"> -->
    <!--        <GoSelectHandle -->
    <!--          :placeholder="placeholder" -->
    <!--          :error="error" -->
    <!--          :disabled="disabled" -->
    <!--          :model-value="modelValue" -->
    <!--          :multiple="multiple" -->
    <!--          :resettable="resettable" -->
    <!--          @toggle="toggle" -->
    <!--          @reset="onReset" -->
    <!--        > -->
    <!--          <template v-if="$slots['handle-text']" #handle-text> -->
    <!--            <slot name="handle-text"></slot> -->
    <!--          </template> -->
    <!--        </GoSelectHandle> -->
    <!--      </template> -->
    <!--      <div class="options"> -->
    <!--        <slot></slot> -->
    <!--      </div> -->
    <!--    </AcvPopover> -->
  </div>
</template>

<style scoped>
  .go-select {
    /* @mixin text-ui-13; */
    --base-popover-padding: 0;
    --go-popover-min-width: 100%;
    position: relative;
    background-color: var(--control-background-color);
    inline-size: min(100%, var(--control-max-width));
    white-space: normal;
  }

  .options {
    display: flex;
    overflow: auto;
    flex-direction: column;
    max-block-size: var(--go-select-options-max-block-size, 344px);
    min-inline-size: 100%;
  }
</style>
