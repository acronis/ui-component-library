<script setup lang="ts">
  import type {
    AcvSelectEvents,
    AcvSelectInjection,
    AcvSelectProps,
    AcvSelectSlots
  } from '@/components/__todo__/select/select.ts';
  import AcvOption from '@/components/__dev__/option/option.vue';
  import {
    SELECT_KEY
  } from '@/components/__todo__/select/select.ts';
  import AcvSelectDropdown from '@/components/__todo__/select/selectDropdown.vue';
  import AcvPopper from '@/components/popper/popper.vue';
  import { UseVirtualList } from '@vueuse/components';
  import { computed, onBeforeMount, provide, reactive, ref } from 'vue';
  import '@/components/__todo__/select/select.css';

  const props = withDefaults(defineProps<AcvSelectProps>(), {
    modelValue: '',
    placeholder: 'Select option...',
    options: () => [],
    disabled: false,
    size: 'medium',
    validationStatus: undefined,
  });

  defineEmits<AcvSelectEvents>();
  const slots = defineSlots<AcvSelectSlots>();
  const model = defineModel();
  const custom = ref<HTMLElement | null>(null);
  const trigger = ref<HTMLElement | null>(null);
  const virtualList = ref<HTMLElement | null>(null);
  const activeIndex = ref(-1);
  const isOpened = ref(false);
  const state = reactive({
    selectedIndex: 0,
    oprions: props.options,
    count: 0
  } as AcvSelectInjection);
  const optionRefs = ref([]);
  const search = ref('');

  const filteredOptions = computed(() => {
    return props.options.filter(i => i.label?.startsWith(search.value.toLowerCase()));
  });

  onBeforeMount(() => {
    if (slots.default?.()?.[0]) {
      state.options = slots.default()[0].children?.filter?.(child => child.type.name === 'AcvOption');
    }
  });

  provide(SELECT_KEY, state);

  const optionsCount = computed(() => props.options.length);
  const selectedIndex = computed(() => props.options.findIndex(option => option.value === model.value));
  const selectedLabel = computed(() => {
    const optionFromProps = (props.options?.length && props.options?.find(option => option.value === model.value));
    const optionFromSlot = state.options?.length && state.options?.find(option => option.props?.value === model.value);

    if (!optionFromProps && !optionFromSlot) {
      return null;
    }
    else if (optionFromProps && optionFromSlot) {
      return optionFromProps?.value || optionFromSlot?.props?.label;
    }

    return null;
  });
  const placeholderText = computed(() => selectedLabel.value ?? props.placeholder);

  function setValue(value) {
    model.value = value;
    closeSelect();
  }

  function openSelect() {
    activeIndex.value = selectedIndex.value;

    // Add related event listeners
    document.addEventListener('keydown', handleKeydown);
  }

  function closeSelect() {
    isOpened.value = false;

    updateActiveIndex(-1);
    trigger.value?.focus();
    // Remove related event listeners
    document.removeEventListener('keydown', handleKeydown);
  }

  function updateActiveIndex(newIndex) {
    activeIndex.value = newIndex;
  }

  function handleClickOption(value) {
    setValue(value);
  }

  function handleKeydown(e) {
    // press down -> go next
    if (e.keyCode === 40 && activeIndex.value < optionsCount.value - 1) {
      const nextActiveIndex = activeIndex.value + 1;
      // @ts-expect-error virtualList is not null
      virtualList.value?.scrollTo(nextActiveIndex);
      // prevent page scrolling
      e.preventDefault();
      updateActiveIndex(nextActiveIndex);
    }

    // press up -> go previous
    if (e.keyCode === 38 && activeIndex.value > 0) {
      // @ts-expect-error virtualList is not null
      virtualList.value?.scrollTo(activeIndex.value - 1);

      e.preventDefault(); // prevent page scrolling
      updateActiveIndex(activeIndex.value - 1);
    }

    // press Enter or space -> select the option
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();

      const value = props.options.find((_option, index) => index === activeIndex.value)?.value;

      if (value) {
        model.value = value;
      }
      closeSelect();
    }

    // press ESC -> close selectCustom
    if (e.keyCode === 27) {
      closeSelect();
    }
  }

  const selectClasses = computed(() => ({
    'acv-select': true
  }));

  const customClasses = computed(() => ({
    custom: true,
    opened: isOpened.value
  }));
</script>

<template>
  <div
    :class="selectClasses"
  >
    <AcvPopper
      ref="custom"
      v-model="isOpened"
      placement="bottom-start"
      :class="customClasses"
      popper-class="custom-options"
      :aria-hidden="!isOpened"
      @keydown="isOpened = !isOpened"
      @show="openSelect"
    >
      <div
        ref="trigger"
        class="custom-trigger"
      >
        {{ placeholderText }}
      </div>
      <template #content>
        <AcvSelectDropdown
          class="custom-options"
        >
          <slot>
            <UseVirtualList
              ref="virtualList"
              :list="filteredOptions"
              :options="{ itemHeight: 40, overscan: 10 }"
              height="300px"
            >
              <template #default="props">
                <AcvOption
                  ref="optionRefs"
                  :value="props.data.value"
                  :active="props.index === activeIndex"
                  :selected="props.index === selectedIndex"
                  @click="handleClickOption(props.data.value)"
                >
                  {{ props.data.label }}
                </AcvOption>
              </template>
            </UseVirtualList>
          </slot>
        </AcvSelectDropdown>
      </template>
    </AcvPopper>
  </div>
</template>

<style scoped>
  .acv-select {
    position: relative;
    min-width: 260px;
    height: 40px;

    .custom:focus,
    .custom.opened .custom-trigger {
      outline: none;
      box-shadow: var(--acv-color-white) 0 0 0 0.2rem, var(--acv-color-button-focus) 0 0 0 0.4rem;
    }

    .custom-trigger {
      align-items: center;
      background-color: var(--acv-color-white);
      border-radius: var(--acv-border-radius-regular);
      border: 1px solid var(--acv-color-layout-primary, hsl(215deg 68% 46%));
      cursor: pointer;
      display: inline-flex;
      font-size: var(--acv-font-size-body);
      height: 40px;
      padding-inline: 16px;
      position: relative;
      width: 100%;
      min-width: 260px;
    }

    .custom-trigger:after {
      content: "▾";
      position: absolute;
      top: 0;
      line-height: 40px;
      right: 16px;
    }

    .custom-trigger:hover {
      border-color: var(--acv-color-primary-light);
    }

    .custom.opened .custom-options {
      display: block;
    }
  }
</style>
