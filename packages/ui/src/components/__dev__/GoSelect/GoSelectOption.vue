<script lang="ts" setup>
  // import CheckmarkSvg from '@constructor/icons/svg/status/checkmark.svg';
  // import { computed, onBeforeMount, onBeforeUnmount, toRef, useSlots, watch } from 'vue';
  // import GoMenuItem from '../GoMenuItem/GoMenuItem.vue';
  // import type { SelectOptionValue } from './select';
  // import { injectSelect } from './select';
  // import {getUniqueIndex} from "@acronis-platform/utils";

  // const props = defineProps<{
  //   value?: SelectOptionValue;
  //   disabled?: boolean;
  // }>();
  //
  // const slots = useSlots();
  // const { multiple, setOption, setOptionValue, unsetOption, onSelect, isSelected } = injectSelect();
  // const id = `go-select-option-${getUniqueIndex()}`;
  // const selected = computed(() => isSelected(props.value));

  // watch(toRef(props, 'value'), () => setOptionValue(id, props.value));
  // onBeforeMount(() => setOption(id, { value: props.value, slots }));
  // onBeforeUnmount(() => unsetOption(id));
</script>

<template>
  <div>GoSelectOption</div>
<!--  <GoMenuItem -->
<!--    v-test-id="[ -->
<!--      'base-select-option', -->
<!--      'go-select-option', -->
<!--      selected && 'base-select-option-selected', -->
<!--      selected && 'go-select-option-selected', -->
<!--    ]" -->
<!--    :ellipsis="true" -->
<!--    :active="selected" -->
<!--    :disabled="disabled" -->
<!--    @select="onSelect(value)" -->
<!--  > -->
<!--    <template v-if="$slots.icon" #icon> -->
<!--      <slot name="icon"></slot> -->
<!--    </template> -->
<!--    <slot></slot> -->
<!--    <template v-if="multiple && selected" #secondary> -->
<!--      <CheckmarkSvg class="xs" /> -->
<!--    </template> -->
<!--    <template v-else-if="$slots.secondary" #secondary> -->
<!--      <slot name="secondary"></slot> -->
<!--    </template> -->
<!--    <template v-if="$slots.description" #description> -->
<!--      <slot name="description"></slot> -->
<!--    </template> -->
<!--  </GoMenuItem> -->
</template>

<style scoped></style>
