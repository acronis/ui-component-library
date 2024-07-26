<script setup lang="ts">
  import './dropdown.css';
  import type { AcvDropdownEvents, AcvDropdownProps, AcvDropdownSlots } from './dropdown.ts';
  import AcvPopper from '@/components/popper/popper.vue';
  import AcvCard from '@/components/card/card.vue';

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
    <slot />
    <template #content>
      <AcvCard>
        <slot name="dropdown" />
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
