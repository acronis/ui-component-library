<script lang="ts" setup>
  import { computed } from 'vue';
  import type { RadioOption } from '@/components/GoRadio/radio.ts';
  import GoPick from '@/components/GoPick/GoPick.vue';

  const props = defineProps<{
    modelValue?: RadioOption
    value?: RadioOption
    name: string
    disabled?: boolean
  }>();
  const emit = defineEmits<{
    (e: 'blur', event: FocusEvent): void
    (e: 'update:model-value', event: RadioOption): void
  }>();
  const proxy = computed({
    get() {
      return props.modelValue;
    },
    set(value: RadioOption) {
      emit('update:model-value', value);
    },
  });

  function onBlur(event: FocusEvent) {
    emit('blur', event);
  }
</script>

<template>
  <GoPick
    class="go-radio"
    :disabled="disabled"
    :class="disabled && 'go-radio_disabled'"
  >
    <template #input>
      <input
        v-model="proxy"
        class="input"
        :value="value"
        :name="name"
        type="radio"
        :disabled="disabled"
        @blur="onBlur"
      >
    </template>
    <template #icon>
      <span class="icon" />
    </template>
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </GoPick>
</template>

<style scoped>
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    background: var(--color-spot-primary);
    block-size: 16px;
    inline-size: 16px;
  }

  .icon:after {
    border-radius: inherit;
    background-color: transparent;
    block-size: 8px;
    content: '';
    inline-size: 8px;
    transform: scale(0.7);
    transition: var(--transition-shortest);
    transition-property: transform, background-color;
  }

  .input:checked + * .icon:after {
    background-color: currentColor;
    transform: scale(1);
  }
</style>
