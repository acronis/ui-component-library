<script setup lang="ts">
  import type { AcvAccordionEvents, AcvAccordionProps, AcvAccordionSlots } from './accordion.ts';
  import { computed, getCurrentInstance, onMounted, provide, ref, watch } from 'vue';
  import { ACCORDION_KEY } from './accordion.ts';

  import './accordion.css';

  /**
   * Vertical stacked interactive headers that reveal associated sections of content.
   *
   * @displayName Accordion component
   * @no-requires ./accordionPanel.vue
   */
  defineOptions({
    name: 'AcvAccordion',
  });

  const {
    expanded,
    modelValue = [],
    multiple,
    size,
  } = defineProps<AcvAccordionProps>();

  const emit = defineEmits<AcvAccordionEvents>();

  const slots = defineSlots<AcvAccordionSlots>();

  const model = defineModel();

  const uuid = ref(getCurrentInstance()?.uid);

  const openedPanels = ref(modelValue);
  const panels = ref<Array<string | number>>([]);

  function setOpenPanels(panels: string[]) {
    const value = multiple ? panels : panels.slice(0, 1);
    openedPanels.value = panels;
    model.value = value;

    emit('update:modelValue', value);
  }

  function handlePanelClick(panelId: string) {
    if (multiple) {
      const panels = openedPanels.value?.slice(0) || [];
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

  function registerPanel(panelId: string) {
    panels.value.push(panelId);
  }

  function unregisterPanel(name: string | number): void {
    panels.value.splice(panels.value.indexOf(name), 1);
  }

  watch(() => modelValue, (value) => {
    openedPanels.value = [...value];
  });

  onMounted(() => {
    if (expanded && multiple) {
      openedPanels.value = slots.default()[0].children
        .filter(child => child.type.__name === 'AcvAccordionPanel')
        .map(node => node.props?.id);
    }
  });

  provide(ACCORDION_KEY, {
    multiple,
    openedPanels,
    uuid,
    handlePanelClick,
    registerPanel,
    unregisterPanel
  });

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
    <slot />
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
