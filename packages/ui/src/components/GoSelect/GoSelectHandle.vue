<script setup lang="ts">
  // import CrossInCircleSolidSvg from '@constructor/icons/svg/action/cross-in-circle-solid.svg';
  // import ChevronUpDownSvg from '@constructor/icons/svg/ui-details/chevron-updown.svg';
  import { computed, ref } from 'vue';
  import type { SelectModel } from './select';
  import { injectSelect } from './select';

  const props = defineProps<{
    error?: boolean
    disabled?: boolean
    modelValue?: SelectModel
    placeholder?: string
    multiple?: boolean
    resettable?: boolean
  }>();
  const emit = defineEmits<{
    (e: 'toggle'): void
    (e: 'reset'): void
  }>();
  const resetContainerElement = ref<HTMLSpanElement | null>(null);
  const { getSlotsByValue, countOptions } = injectSelect();
  const selectedValues = computed(() => getSelectedValues());
  const isResetIconVisible = computed(() => props.resettable && selectedValues.value.length > 0);
  const selectedSlot = computed(() =>
    selectedValues.value.length === 1 ? getSlotsByValue(selectedValues.value[0]) : undefined,
  );

  function getSelectedValues() {
    if (!props.multiple) {
      return props.modelValue != null ? [props.modelValue] : [];
    }

    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }

  function onClick(event: MouseEvent) {
    const target = event.target as Node;

    if (resetContainerElement.value?.contains(target)) {
      emit('reset');
      return;
    }

    if (countOptions.value) {
      emit('toggle');
    }
  }
</script>

<template>
  <button
    type="button"
    class="go-select-handle"
    :class="error && 'go-select-handle_error'"
    :disabled="!countOptions || disabled"
    @click="onClick"
  >
    <span
      v-if="!$slots['handle-text'] && selectedSlot?.icon"
      class="icon"
    >
      <Component :is="selectedSlot.icon" />
    </span>
    <span class="content">
      <span
        v-if="$slots['handle-text'] && selectedValues.length >= 1"
        class="ellipsis"
      >
        <slot name="handle-text" />
      </span>
      <span
        v-else-if="selectedSlot?.default"
        class="ellipsis"
      >
        <Component
          :is="selectedSlot.default"
          :active="true"
        />
      </span>
      <template v-else-if="multiple && selectedValues.length >= 1">
        {{ selectedValues.length }} selected
      </template>
      <span
        v-else-if="countOptions"
        class="placeholder"
      >
        {{ placeholder }}
      </span>
      <span
        v-else
        class="placeholder"
      >No options</span>
    </span>
    <span
      v-if="isResetIconVisible"
      ref="resetContainerElement"
      class="reset-icon"
    >
      <!--      <CrossInCircleSolidSvg /> -->
    </span>
    <!--    <ChevronUpDownSvg /> -->
  </button>
</template>

<style scoped>
  .go-select-handle {
    --base-icon-size: var(--icon-size-xxs);
    display: flex;
    flex-grow: 1;
    align-items: center;
    border: var(--go-select-border, var(--base-select-border, var(--border-primary)));
    border-radius: var(--go-select-border-radius, var(--base-select-border-radius, 0));
    block-size: var(--base-select-height, var(--control-height));
    gap: 8px;
    padding-block: 0;
    padding-inline: 8px;
  }

  /* TODO: move & before :where, after vue fix issue https://github.com/vuejs/core/issues/10511 */
  :where(:focus-visible).go-select-handle {
    border-color: var(--color-line-accent);
    outline: var(
      --go-select-focus-outline,
      var(--base-select-focus-outline, 1px solid var(--color-framing-focus))
    );
  }

  .go-select-handle:disabled {
    background-color: var(--color-spot-tretiary);
    color: var(--color-glyph-disabled);
  }

  .go-select-handle_error {
    border-color: var(--color-glyph-danger);
    outline-color: var(--color-glyph-danger);
  }

  .go-select-handle:not(:disabled) {
    cursor: pointer;
  }

  .content {
    display: grid;
    flex-grow: 1;
  }

  .icon {
    --base-icon-size: var(--icon-size-xs);
    display: flex;
    align-items: center;
  }

  .reset-icon {
    --base-icon-size: var(--icon-size-xs);
    display: inline-flex;
  }

  .placeholder {
    color: var(--color-glyph-secondary);
  }
</style>
