<script setup lang="ts">
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import { IconMore16 } from '@acronis-platform/icons/more';
  </script>

<template>
  <AcvDropdown
    trigger="click"
    placement="bottom"
    hide-on-click
  >
    <AcvButton
      variant="ghost"
      :icon="IconMore16"
      color="secondary"
    />
    <template #dropdown>
      <slot />
    </template>
  </AcvDropdown>
</template>

<style scoped>
</style>
