<script lang="ts" setup>
  import type { GoInputProps, InputExpose } from './input';
  // import EyeCrossed from '@constructor/icons/svg/action/eye-crossed.svg';
  // import EyeSvg from '@constructor/icons/svg/action/eye.svg';
  // import CloseSvg from '@constructor/icons/svg/navigation/close.svg';
  import { computed, onMounted, ref, toRef, watch } from 'vue';
  // import GoBarButton from '../GoBarButton/GoBarButton.vue';
  import { getUniqueIndex } from '@acronis-platform/utils';
  import { getAutosize } from './input';
  import { cleanValueByMask, getMaskParser } from './inputMasks';
  import { parse } from './inputParsers';

  defineOptions({ inheritAttrs: false });
  const props = withDefaults(defineProps<GoInputProps>(), {
    id: () => getUniqueIndex().toString(),
    modelValue: '',
    type: 'text',
    resize: true,
    autosize: false,
  });
  const emit = defineEmits<{ (e: 'update:model-value', value: string): void }>();
  const wrapperRef = ref<HTMLDivElement>();
  const inputRef = ref<HTMLInputElement>();
  const innerType = ref(props.type);
  const isPassword = computed(() => props.type === 'password');
  const isTextarea = computed(() => props.type === 'textarea');
  const parsers = computed(() => {
    const list = typeof props.parsers === 'function' ? [props.parsers] : props.parsers ?? [];

    return list.concat(props.mask ? getMaskParser(props.mask) : []);
  });
  const inputValue = ref('');
  const showClearable = computed(() => props.clearable && !!inputValue.value);
  const textareaMinHeightPx = ref<string>();
  const controlHeight = computed(() => getControlHeight());
  const bordersHeight = computed(() => getBordersHeight());
  const bordersHeightPx = computed(() => `${bordersHeight.value}px`);
  const rows = computed(() => getAutosize(props.autosize));
  const minRows = computed(() => rows.value.min);
  const maxRows = computed(() => rows.value.max);

  defineExpose<InputExpose>({ clear, focus, blur, reset });
  watch(toRef(props, 'modelValue'), onModelChange, { immediate: true });
  watch([rows, inputValue, inputRef, wrapperRef], onTextChange, { flush: 'post' });
  onMounted(() => props.autofocus && focus());

  function onModelChange(value: string | number) {
    // if value changed from the outside of this component
    if (cleanValue(inputValue.value) !== value.toString()) {
      inputValue.value = parse(parsers.value, value.toString()).value;
    }
  }

  function getBordersHeight() {
    if (!wrapperRef.value) {
      return 0;
    }

    return wrapperRef.value.offsetHeight - wrapperRef.value.clientHeight;
  }

  function getControlHeight() {
    if (!wrapperRef.value) {
      return 0;
    }

    return Number.parseInt(getComputedStyle(wrapperRef.value).getPropertyValue('--control-height'), 10);
  }

  function onTextChange() {
    if (props.type !== 'textarea') {
      return;
    }

    const input = inputRef.value!;
    const { style } = input;
    const resizeHeight = style.height;
    // remove height(which is set by browser during resizing) to correctly calculate textareaMinHeightPx
    style.overflow = 'hidden';
    style.minHeight = 'auto';
    style.height = '';

    // keep height if no autosize and set it as scrollHeight if autosize is set
    const height = props.autosize ? input.scrollHeight : input.clientHeight;
    // use controlHeight as min value for height
    textareaMinHeightPx.value = `${Math.max(controlHeight.value, height) - bordersHeight.value}px`;

    style.height = resizeHeight;
    style.overflow = '';
    style.minHeight = '';
  }

  function clear() {
    setInputValue('');
  }

  function focus() {
    // need setTimeout here to wait click event bubble end
    setTimeout(() => inputRef.value?.focus());
  }

  function blur() {
    inputRef.value?.blur();
  }

  /**
   * Sometimes we need to trigger onModelChange from outside
   */
  function reset() {
    onModelChange(props.modelValue);
  }

  function toggleType() {
    innerType.value = innerType.value === props.type ? 'text' : props.type;
  }

  function onInput(event: InputEvent) {
    const element = event.target as HTMLInputElement;
    const { value, selection } = parse(parsers.value, element.value, element.selectionEnd || 0);

    if (element.value !== value) {
      element.value = value;
      element.setSelectionRange(selection, selection);
    }

    setInputValue(value);
  }

  function setInputValue(value: string) {
    inputValue.value = value;
    emit('update:model-value', cleanValue(value));
  }

  function cleanValue(value: string) {
    return (props.mask ? cleanValueByMask(value, props.mask) : value).trim();
  }
</script>

<template>
  <div
    ref="wrapperRef"
    v-test-id="['base-input', 'go-input']"
    class="go-input"
    :class="[
      error && 'go-input_error',
      disabled && 'go-input_disabled',
      isTextarea && 'go-input_textarea',
      autosize && 'go-input_autosize',
      $props.class,
    ]"
  >
    <label
      v-if="$slots.prefix"
      :for="id"
      class="prefix"
    >
      <slot name="prefix" />
    </label>
    <Component
      :is="isTextarea ? 'textarea' : 'input'"
      :id="id"
      ref="inputRef"
      :value="inputValue"
      class="field"
      :class="!resize && 'field_no-resize'"
      :type="isTextarea ? undefined : innerType"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      v-bind="$attrs"
      @input="onInput"
    />
    <div
      v-if="showClearable || $slots.suffix || isPassword"
      class="suffix"
    >
      <slot name="suffix" />
      <AcvButton
        v-if="showClearable"
        size="sm"
        @click="clear"
      >
        <!--        <CloseSvg /> -->
      </AcvButton>
      <AcvButton
        v-if="isPassword"
        class="eye"
        size="sm"
        @click="toggleType"
      >
        <!--        <EyeCrossed v-if="innerType === 'password'" /> -->
        <!--        <EyeSvg v-else /> -->
      </AcvButton>
    </div>
  </div>
</template>

<style scoped>
  .go-input {
    --base-icon-size: var(--icon-size-xs);
    --input-line-height: var(
      --go-input-line-height,
      var(--base-input-line-height, var(--line-height-text-ui-13))
    );
    --input-border-width: var(--go-input-border-width, var(--base-input-border-width, 1px));
    position: relative;
    display: inline-flex;
    padding: var(--go-input-container-padding, var(--base-input-container-padding, 0));
    border: var(--go-input-border, var(--base-input-border, var(--border-primary)));
    border-width: var(--input-border-width);
    border-radius: var(--go-input-border-radius, var(--base-input-border-radius, 0));
    background-color: var(--control-background-color);
    block-size: var(--control-height);
    border-block-end-width: var(--base-input-border-bottom-width, var(--input-border-width));
    color: var(--go-input-color, var(--base-input-color, var(--color-glyph-primary)));
    font-size: var(--go-input-font-size, var(--base-input-font-size, var(--font-size-ui-13)));
    inline-size: var(--go-input-inline-size, var(--base-input-inline-size, 100%));
    line-height: var(--input-line-height);
    transition: var(--transition-shortest);
    transition-property: border-color, outline;
  }

  /* TODO: move & before :where, after vue fix issue https://github.com/vuejs/core/issues/10511 */
  :where(:hover).go-input {
    border-color: var(
      --go-input-border-hover-color,
      var(--base-input-border-hover-color, var(--color-glyph-tretiary))
    );
  }

  /* TODO: move & before :where, after vue fix issue https://github.com/vuejs/core/issues/10511 */
  :where(:focus-within).go-input {
    border-color: var(--color-line-accent);
    outline: var(
      --go-input-focus-outline,
      var(--base-input-focus-outline, 1px solid var(--color-framing-focus))
    );
  }

  .go-input_error {
    border-color: var(--color-glyph-danger);
    outline-color: var(--color-glyph-danger);
  }

  .go-input_disabled {
    border-color: var(--color-line-primary);
    background-color: var(
      --go-input-disabled-background-color,
      var(--base-input-disabled-background-color, var(--color-spot-disabled))
    );
    color: var(
      --go-input-disabled-color,
      var(--base-input-disabled-color, var(--color-glyph-disabled))
    );
  }

  .go-input_textarea {
    block-size: auto;
  }

  .field {
    border: 0;
    border-radius: inherit;
    background-color: transparent;
    block-size: 100%;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--base-input-font-weight);
    inline-size: 100%;
    line-height: inherit;
    outline: 0;
    padding-block: 0;
    padding-inline: var(--go-input-padding-left, var(--base-input-padding-left, 8px))
      var(--go-input-padding-right, var(--base-input-padding-right, 8px));
    text-align: var(--go-input-text-align, var(--base-input-text-align, left));
    text-transform: var(--go-input-text-transform, var(--base-input-text-transform, none));
  }

  .field[type='number'] {
    appearance: textfield;
  }

  .field[type='number']::-webkit-outer-spin-button,
  .field[type='number']::-webkit-inner-spin-button {
    appearance: none;
  }

  .go-input_textarea .field {
    --input-textarea-padding-block: var(
      --go-input-textarea-padding-block,
      var(--base-input-textarea-padding-block, 4px)
    );
    --input-vertical-padding: calc(var(--input-textarea-padding-block) * 2);
    --min-available-height: calc(
      var(--input-line-height) * v-bind(minRows) + var(--input-vertical-padding) -
        v-bind(bordersHeightPx)
    );
    --max-available-height: calc(
      var(--input-line-height) * v-bind(maxRows) + var(--input-vertical-padding) -
        v-bind(bordersHeightPx)
    );
    block-size: var(--min-available-height, 0);
    max-block-size: var(--max-available-height);
    min-block-size: min(var(--max-available-height), v-bind(textareaMinHeightPx));
    padding-block: calc(var(--input-textarea-padding-block) - v-bind(bordersHeightPx));
    resize: vertical;
  }

  .go-input_textarea .field:disabled::placeholder {
    opacity: 1;
  }

  .go-input_textarea .field_no-resize {
    resize: none;
  }

  .eye {
    color: var(--color-glyph-tretiary);
  }

  .prefix,
  .suffix {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 8px;
  }

  .suffix {
    margin-inline-end: var(
      --go-input-suffix-margin-right,
      var(--base-input-suffix-margin-right, 4px)
    );
  }
</style>
