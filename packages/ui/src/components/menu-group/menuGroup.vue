<script setup lang="ts">
  import type {
    AcvMenuGroupEvents,
    AcvMenuGroupProps,
    AcvMenuGroupSlots
  } from './menuGroup.ts';
  import { type AcvMenuInjection, MENU_KEY } from '@/components/index.ts';
  import { useLevel } from '@/components/menu-item/useLevel.ts';
  import { inject } from 'vue';

  import './menuGroup.css';

  const { title } = defineProps<AcvMenuGroupProps>();
  defineEmits<AcvMenuGroupEvents>();
  const slots = defineSlots<AcvMenuGroupSlots>();

  const { menuProps } = inject(MENU_KEY, {}) as AcvMenuInjection;
  const { indent } = useLevel();
</script>

<template>
  <menu
    v-show="!menuProps?.collapse"
    class="acv-menu-group"
  >
    <li
      v-if="title || slots.title"
      class="title acv-text acv-text--accent acv-text--ellipsis"
    >
      <slot name="title">
        {{ title }}
      </slot>
    </li>
    <slot />
  </menu>
</template>

<style scoped>
  .acv-menu-group {
    --acv-menu-item-indent: v-bind(indent);
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-menu-group-color);

    .title {
      padding: 24px 0 8px 56px;
      padding-inline-start: var(--acv-menu-item-indent);
      color: var(--acv-color-nav-label-secondary, hsl(0deg 0% 100% / 0.7));
    }
  }
</style>
