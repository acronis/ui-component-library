<script lang="ts" setup>
  import type { GoInputNumberProps, InputExpose } from '@/components/__dev__/GoInput/input.ts';
  import type { InputParserResult } from '@/components/__dev__/GoInput/inputParsers.ts';
  import GoInput from '@/components/__dev__/GoInput/GoInput.vue';
  import { getParseResult } from '@/components/__dev__/GoInput/inputParsers.ts';
  // import MinusSvg from '@constructor/icons/svg/action/minus.svg';
  // import PlusSvg from '@constructor/icons/svg/action/plus.svg';
  import { computed, nextTick, ref, watch } from 'vue';

  const props = withDefaults(defineProps<GoInputNumberProps>(), { step: 1 });
  const emit = defineEmits<{
    (e: 'update:model-value', value: number | undefined): void
    (e: 'blur', event: FocusEvent): void
  }>();
  const isChanged = ref(false);
  const inputRef = ref<InputExpose>();
  const currentValue = ref('');
  const nextValue = ref(props.modelValue);
  watch(() => props.modelValue, setCurrentValue, { immediate: true });

  function setCurrentValue(value: number | undefined) {
    const numberValue = convertToNumber(currentValue.value);

    // check with 0 to not override -0 with 0 in input. yep, 0 === -0
    if (numberValue === 0 && value === 0) {
      return;
    }

    currentValue.value = value?.toString() ?? '';
  }

  function onInputChange(newValue: string) {
    const numberValue = convertToNumber(newValue);

    // NaN could be when user cleans input or types dot
    if (Number.isNaN(numberValue)) {
      // if we have min - set min. Because in most cases we here when user clean input
      nextValue.value = props.min !== undefined ? props.min : undefined;
      isChanged.value = true;
      return;
    }

    if (props.max !== undefined && numberValue > props.max) {
      nextValue.value = props.max;
      isChanged.value = true;
      return;
    }

    if (props.min !== undefined && numberValue < props.min) {
      nextValue.value = props.min;
      isChanged.value = true;
      return;
    }

    isChanged.value = false;
    nextValue.value = numberValue;
    setCurrentValue(numberValue);
    emit('update:model-value', numberValue);
  }

  function handleMinus() {
    const numberValue = convertToNumber(currentValue.value);
    const newNumberValue
      = props.min !== undefined && numberValue - props.step < props.min
        ? props.min
        : numberValue - props.step;
    onInputChange(newNumberValue.toString());
  }

  function handlePlus() {
    const numberValue = convertToNumber(currentValue.value);
    const newNumberValue
      = props.max !== undefined && numberValue + props.step > props.max
        ? props.max
        : numberValue + props.step;
    onInputChange(newNumberValue.toString());
  }

  const canMinus = computed(() => {
    const numberValue = convertToNumber(currentValue.value);
    return !props.min || numberValue > props.min;
  });

  const canPlus = computed(() => {
    const numberValue = convertToNumber(currentValue.value);
    return !props.max || numberValue < props.max;
  });

  function convertToNumber(value: string) {
    const numberValue = props.float ? Number.parseFloat(value) : Number.parseInt(value, 10);

    return Object.is(numberValue, -0) ? 0 : numberValue;
  }

  function parseNumber(value: string, selection: number): InputParserResult {
    const [before, after] = [value.substring(0, selection), value.substring(selection)];
    const replacer = getNumberSymbolsReplacer();
    // remove all non-numeric characters
    const newBefore = before.replace(/[^\d.,-]/g, '').replace(/[.,-]/g, replacer);
    const newAfter = after.replace(/[^\d.,-]/g, '').replace(/[.,-]/g, replacer);
    // if we remove something before cursor - move it to the left
    const countRemoved = before.length - newBefore.length;

    return getParseResult(`${newBefore}${newAfter}`, selection, countRemoved);
  }

  function getNumberSymbolsReplacer() {
    let delimiterFound = false;
    let firstSymbolChecked = false;

    return (symbol: string, position: number, str: string) => {
      if (symbol === '-' && position === 0 && !firstSymbolChecked) {
        // '-' at 0 position is a valid symbol
        firstSymbolChecked = true;
        return '-';
      }
      else if (symbol === '.' || symbol === ',') {
        if (position === 0 && !firstSymbolChecked && !delimiterFound) {
          // handle case when user enter "." at 0 position and add extra 0 to make input valid
          firstSymbolChecked = true;
          delimiterFound = true;
          return '0.';
        }

        if (!delimiterFound) {
          firstSymbolChecked = true;
          delimiterFound = true;
          return str === '-.' ? '0.' : '.';
        }
      }

      firstSymbolChecked = true;
      return '';
    };
  }

  /**
   * If user types number from outside min/max limits then we roll back it to valid range
   */
  function onBlur(event: FocusEvent) {
    if (isChanged.value) {
      isChanged.value = false;
      setCurrentValue(nextValue.value);
      emit('update:model-value', nextValue.value);
    }

    nextTick(() => inputRef.value?.reset());
    emit('blur', event);
  }
</script>

<template>
  <GoInput
    ref="inputRef"
    v-bind="props"
    v-model="currentValue"
    :parsers="parseNumber"
    inputmode="numeric"
    class="go-input-number"
    @blur="onBlur"
    @update:model-value="onInputChange"
  >
    <template
      v-if="$slots.prefix"
      #prefix
    >
      <slot name="prefix" />
    </template>
    <template
      v-if="props.controls"
      #suffix
    >
      <div class="controls">
        <button
          class="control"
          :class="[!canMinus && 'control_disabled']"
          type="button"
          @click.prevent="handleMinus"
        >
          <!--          <MinusSvg /> -->
        </button>
        <button
          class="control"
          :class="[!canPlus && 'control_disabled']"
          type="button"
          @click.prevent="handlePlus"
        >
          <!--          <PlusSvg /> -->
        </button>
      </div>
    </template>
  </GoInput>
</template>

<style scoped>
  .controls {
    --icon-size: var(--icon-size-xxxs);
    --input-number-control-width: var(--go-input-number-control-width, 20px);
    --input-number-control-height: var(--go-input-number-control-height, 24px);
    position: absolute;
    display: flex;
    block-size: var(--input-number-control-height);
    inset-block-start: calc(50% - var(--input-number-control-height) / 2);
    inset-inline-end: 1px;
    user-select: none;
  }

  .control {
    display: flex;
    align-items: center;
    justify-content: center;
    block-size: var(--input-number-control-height);
    cursor: pointer;
    inline-size: var(--input-number-control-width);
    opacity: 0;
    transition: opacity var(--transition-shortest);
  }

  .control_disabled {
    cursor: not-allowed;
  }

  .go-input-number:hover .control {
    opacity: 1;
  }

  .control:hover:not(.control_disabled) {
    background-color: var(--color-overlay-hover);
  }
</style>
