<script setup lang="ts">
  import type {
    AcvAutocompleteEvents,
    AcvAutocompleteProps,
    AcvAutocompleteSlots
  } from './autocomplete.ts';
  import './autocomplete.css';

  const { title, description } = defineProps<AcvAutocompleteProps>();

  defineEmits<AcvAutocompleteEvents>();
  defineSlots<AcvAutocompleteSlots>();
</script>

<template>
  <div class="acv-autocomplete">
    <slot>{{ title }}</slot>
    <slot
      name="description"
      :description="description"
    >
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-autocomplete {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-autocomplete-color);
  }
</style>
