<script lang="ts" setup>
  import type { GoToggleSize } from '@/components/GoToggle/helpers.ts';
  import GoCheckbox from '@/components/GoCheckbox/GoCheckbox.vue';

  withDefaults(
    defineProps<{
      size?: GoToggleSize
      disabled?: boolean
    }>(),
    {
      size: 'md',
    },
  );
</script>

<template>
  <GoCheckbox :disabled="disabled">
    <template #icon>
      <div
        class="toggle-icon"
        :class="[`toggle-icon_size_${size}`, disabled && 'toggle-icon_disabled']"
      />
    </template>
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </GoCheckbox>
</template>

<style scoped>
  .toggle-icon {
    --toggle-dot-size: 13px;
    --toggle-width: 28px;
    display: flex;
    align-items: center;
    padding: 1px;
    border-radius: 10px;
    background-color: var(--color-glyph-secondary);
    block-size: 16px;
    inline-size: var(--toggle-width);
    transition: background-color var(--transition-shortest);
  }

  .toggle-icon_disabled {
    background-color: var(--color-glyph-tretiary);
  }

  .toggle-icon_size_sm {
    --toggle-dot-size: 11px;
    --toggle-width: 24px;
    border-radius: 7px;
    block-size: 14px;
  }

  .toggle-icon:after {
    border-radius: 50%;
    background-color: var(--color-spot-primary);
    block-size: var(--toggle-dot-size);
    content: '';
    inline-size: var(--toggle-dot-size);
    transform: translateZ(0); /* it's fix Safari Flickering bug  */
    transition: transform var(--transition-shortest);
  }

  :deep(.go-checkbox-input):checked + * .toggle-icon {
    background-color: var(--color-glyph-success);
  }

  :deep(.go-checkbox-input):checked + * .toggle-icon:after {
    transform: translateX(calc(var(--toggle-width) - var(--toggle-dot-size) - 2px)) translateZ(0); /* it's fix Safari Flickering bug  */
  }
</style>
