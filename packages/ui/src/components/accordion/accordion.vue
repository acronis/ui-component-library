<script setup lang="ts">
  import { computed, getCurrentInstance, onMounted, provide, ref, watch } from 'vue';
  import type { AccordionEvents, AccordionProps, AccordionSlots } from './accordion.ts';
  import { ACCORDION_KEY } from './accordion.ts';
  import './accordion.css';

  const {
    expanded,
    modelValue = [],
    multiple,
    size,
  } = defineProps<AccordionProps>();

  const emit = defineEmits<AccordionEvents>();

  const slots = defineSlots<AccordionSlots>();

  const model = defineModel();

  const uuid = ref(getCurrentInstance()?.uid);

  const openedPanels = ref(modelValue);

  function setOpenPanels(panels: string[]) {
    const value = multiple ? panels : panels.slice(0, 1);
    openedPanels.value = panels;
    model.value = value;

    emit('update:modelValue', value);
  }

  function handlePanelClick(panelId: string) {
    if (multiple) {
      const panels = openedPanels.value.slice(0);
      const index = panels.indexOf(panelId);

      if (index > -1) {
        panels.splice(index, 1);
      }
      else {
        panels.push(panelId);
      }
      setOpenPanels(panels);
    }
    else {
      setOpenPanels([panelId]);
    }
  }

  watch(() => modelValue, (value) => {
    openedPanels.value = [...value];
  });

  onMounted(() => {
    if (expanded && multiple) {
      openedPanels.value = slots.default()[0].children
        .filter(child => child.type.__name === 'AccordionPanel')
        .map(node => node.props?.id);
    }
  });

  provide(ACCORDION_KEY, { multiple, openedPanels, uuid, handlePanelClick });

  const classes = computed(() => {
    return {
      'acv-accordion': true,
      [`acv-accordion--size-${size}`]: size,
    };
  });
</script>

<template>
  <div
    class="acv accordion"
    :class="classes"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.acv {
  &.accordion {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-accordion-color);
    border: 2px solid;
    border-radius: 0.5rem;
    overflow: hidden;
  }
}
</style>
