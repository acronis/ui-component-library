<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import { IconClose16 } from '@acronis-platform/icons/close';
  import type { AcvChipEvents, AcvChipProps } from './chip.ts';

  import './chip.css';

  /**
   * Chips or badges are small, interactive elements that represent a piece of information,
   * such as a tag, a category, or a status.
   *
   * @displayName Chip component
   */
  defineOptions({
    name: 'AcvChip',
  });

  const {
    icon,
    showClose = false,
    showHoverHint = false,
  } = defineProps<AcvChipProps>();

  const emit = defineEmits<AcvChipEvents>();

  const slots = useSlots();

  const title = computed(() => {
    if (!showHoverHint)
      return undefined;

    const defaultSlot = slots.default?.();

    if (defaultSlot?.[0]) {
      return defaultSlot[0].children!.toString();
    }

    return undefined;
  });
</script>

<template>
  <div class="acv-chip">
    <component
      :is="icon"
      v-if="icon"
      class="icon"
    />
    <span
      class="text"
      :title="title"
    >
      <slot />
    </span>

    <IconClose16
      v-if="showClose"
      :icon="IconClose16"
      class="close"
      @click="emit('close')"
    />
  </div>
</template>

<style scoped>
  .acv-chip {
    align-items: center;
    background-color: var(--acv-color-surface-primary);
    border-radius: calc(var(--acv-chip-height) * .5);
    border: var(--acv-border-small) var(--acv-color-form-secondary);
    box-sizing: border-box;
    color: var(--acv-chip-color);
    display: inline-flex;
    flex-direction: row;
    font-family: var(--acv-font-family-default), sans-serif;
    font-size: var(--acv-font-size-body);
    font-weight: var(--acv-font-weight-regular);
    height: var(--acv-chip-height);
    line-height: var(--acv-font-line-height-regular);
    padding-inline: 12px;
    position: relative;
    text-align: center;
    vertical-align: middle;
    gap: 8px;

    .text {
      display: inline-block;
      max-width: 223px;
      vertical-align: top;

      /* ellipsis */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }

    .acv-icon {
      color: var(--acv-chip-icon-color)
    }

    .close {
      cursor: pointer;

      &:hover {
        color: var(--acv-color-form-secondary);
      }
    }

    &+& {
      margin-left: 8px;
    }
  }
</style>
