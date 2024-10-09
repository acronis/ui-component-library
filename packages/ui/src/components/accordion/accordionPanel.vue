<script setup lang="ts">
  import type { AcvAccordionInjection, AcvAccordionPanelProps, AcvAccordionPanelSlots } from './accordion.ts';
  import { isDefined } from '@vueuse/core';
  import { computed, getCurrentInstance, inject, onMounted, onUnmounted } from 'vue';
  import { ACCORDION_KEY } from './accordion.ts';

  /**
   * Composable component that represents a panel in the accordion.
   *
   * @displayName Accordion Panel component
   */
  defineOptions({
    name: 'AcvAccordionPanel',
  });
  const { id, title, background } = defineProps<AcvAccordionPanelProps>();
  defineSlots<AcvAccordionPanelSlots>();

  const {
    multiple,
    openedPanels,
    uuid,
    handlePanelClick,
    registerPanel,
    unregisterPanel
  } = inject(ACCORDION_KEY) as AcvAccordionInjection;
  const panelId = id || getCurrentInstance()?.uid.toString();

  const isOpened = computed(() =>
    openedPanels?.value?.includes(id)
  );

  const panelClasses = computed(() => ({
    'acv-accordion-panel': true,
    [`acv-accordion-panel--background-${background}`]: background
  }));

  onMounted(() => {
    if (isDefined(panelId)) {
      registerPanel(panelId);
    }
  });

  onUnmounted(() => {
    if (isDefined(panelId)) {
      unregisterPanel(panelId);
    }
  });
</script>

<template>
  <div
    :class="panelClasses"
    :aria-expanded="isOpened"
    role="tab"
  >
    <input
      :id="panelId"
      :type="multiple ? 'checkbox' : 'radio'"
      :name="`accordion-${uuid}`"
      :checked="isOpened"
      @click="panelId && handlePanelClick(panelId)"
    >
    <label
      :for="panelId"
      class="acv-accordion-panel__label"
    >
      <slot name="label">
        {{ title }}
      </slot>
    </label>
    <div class="acv-accordion-panel__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.acv-accordion-panel input {
  position: absolute;
  opacity: 0;
  z-index: var(--acv-z-index-negative)
}

.acv-accordion-panel__content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.35s;
}

.acv-accordion-panel input:checked ~ .acv-accordion-panel__content {
  max-height: 10rem;
}

.acv-accordion-panel__label {
  display: flex;
  color: var(--acv-accordion-label-color);
  background: var(--acv-accordion-label-bg-color);
  cursor: pointer;
  justify-content: space-between;
  padding: 1rem;
  font-size: var(--acv-accordion-label-font-size-medium);
}

.acv-accordion-panel__label:after {
  content: "\276F";
  width: 1em;
  height: 1em;
  text-align: center;
  transform: rotate(90deg);
  transition: all 0.35s;
}

.acv-accordion-panel input:checked + .acv-accordion-panel__label:after {
  transform: rotate(270deg);
  position: relative;
  left: -5px;
}

.acv-accordion-panel__content p {
  margin: 0;
  padding: 1rem;
}

/* Size modifiers */

.acv-accordion--size-small .acv-accordion-panel__label {
  padding: .2rem;
  font-size: var(--acv-accordion-label-font-size-small);
}

.acv-accordion--size-small .acv-accordion-panel__content p {
  font-size: var(--acv-accordion-label-font-size-small);
}

.acv-accordion--size-large .acv-accordion-panel__label {
  padding: 2rem;
  font-size: var(--acv-accordion-label-font-size-large);
}

/* Panel background */

.acv-accordion-panel--background-primary .acv-accordion-panel__content {
  background-color: var(--acv-color-primary);
  color: var(--acv-color-text-inversed-primary);
}

.acv-accordion-panel--background-secondary .acv-accordion-panel__content {
  background-color: var(--acv-color-secondary);
}
</style>
