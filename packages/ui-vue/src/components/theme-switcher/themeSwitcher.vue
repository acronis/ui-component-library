<script setup lang="ts">
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import { useColorScheme } from '@/composables/useColorScheme.ts';

  const { setColorScheme, colorScheme: currentColorScheme } = useColorScheme();
</script>

<template>
  <AcvDropdown
    trigger="click"
  >
    <slot>
      <AcvButton>
        Change color scheme
      </AcvButton>
    </slot>
    <template #dropdown>
      <ul>
        <li
          v-for="(colorScheme) in ['light', 'dark'] as const"
          :key="colorScheme"
          :data-test="`color-scheme-item-${colorScheme}`"
          class="color"
          :class="{
            selected: colorScheme === currentColorScheme }"
          @click="setColorScheme(colorScheme)"
        >
          {{ colorScheme }}
        </li>
      </ul>
    </template>
  </AcvDropdown>
</template>

<style scoped>
  .color {
    padding: 0.5rem;
    cursor: pointer;

    &:hover {
      background-color: var(--acv-color-white);
    }
  }

  .selected {
    font-weight: 700;
    background-color: var(--acv-color-brand-secondary);
  }
</style>
