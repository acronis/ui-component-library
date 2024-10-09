<script lang="ts" setup>
  import type { RadioOption } from '@/components/GoRadio/radio.ts';
  import GoRadio from '@/components/GoRadio/GoRadio.vue';
  import { useRadioGroup } from '@/components/GoRadio/radio.ts';
  import { computed } from 'vue';

  const props = defineProps<{
    value?: RadioOption
    disabled?: boolean
  }>();
  const emit = defineEmits<{ (e: 'blur', event: FocusEvent): void }>();
  const group = useRadioGroup();
  const proxy = computed({
    get() {
      return group.props.modelValue;
    },
    set(value: RadioOption) {
      group.emit('update:model-value', value);
    },
  });
  const isDisabled = computed(() => props.disabled || group.props.disabled);
  const radioName = computed(() => group.props.name);

  function onBlur(event: FocusEvent) {
    emit('blur', event);
    group.emit('blur', event);
  }
</script>

<template>
  <GoRadio
    v-model="proxy"
    :value="value"
    :name="radioName"
    :disabled="isDisabled"
    @blur="onBlur"
  >
    <template
      v-for="(_, name) of $slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </GoRadio>
</template>
