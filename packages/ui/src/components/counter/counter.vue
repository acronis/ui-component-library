<script setup lang="ts">
  import type {
    AcvCounterEvents,
    AcvCounterProps,
    AcvCounterSlots
  } from './counter.ts';
  import './counter.css';

  const { count } = defineProps<AcvCounterProps>();

  defineEmits<AcvCounterEvents>();
  defineSlots<AcvCounterSlots>();
</script>

<template>
  <div class="acv-counter">
    <slot>{{ count }}</slot>
  </div>
</template>

<style scoped>
  .acv-counter {
    /* Layout */
    display: flex;
    padding: 4px 8px;
    align-items: flex-start;
    gap: 4px;

    /* Style */
    border-radius: 12px;
    background: var(--Layout-brand-accent, rgb(38 104 197 / 0.10));

    /* Typography */
    color: var(--Technical-dark, rgb(36 49 67 / 0.90));

    /* 11-16 note/note-heading */
    font-family: var(--acv-base-font-family-inter);
    font-size: var(--acv-font-size-note);
    font-style: normal;
    font-weight: 700;
    line-height: 16px; /* 145.455% */
    letter-spacing: 1px;
    text-transform: uppercase;
  }
</style>
