<script setup lang="ts">
  import type { AcvDropdownEvents, AcvDropdownProps, AcvDropdownSlots } from 'src/components/dropdown/dropdown.ts';
  import './dropdown.css';
  import AcvPopper from '../popper/popper.vue';
  import AcvCard from '../card/card.vue';

  defineOptions({
    name: 'AcvDropdown'
  });

  const props = defineProps<AcvDropdownProps>();

  defineEmits<AcvDropdownEvents>();
  defineSlots<AcvDropdownSlots>();
</script>

<template>
  <AcvPopper
    v-bind="{ ...props }"
    class="acv-dropdown"
  >
    <slot></slot>
    <template #content>
      <AcvCard>
        <slot name="dropdown"></slot>
      </AcvCard>
    </template>
  </AcvPopper>
</template>

<style scoped>
  .acv-dropdown {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-dropdown-color);
  }
</style>
