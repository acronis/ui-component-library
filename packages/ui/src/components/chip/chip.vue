<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import AcvButton from '../button/button.vue';
  import AcvIcon from '../icon/icon.vue';
  import type { AcvChipProps } from './chip.ts';
  import './chip.css';

  const {
    iconName,
    showClose = false
  } = defineProps<AcvChipProps>();

  defineEmits<{
    /**
     * Emitted when the close button is clicked.
     * @arg {string} event - The event
     */
    close: []
  }>();

  const slots = useSlots();

  const title = computed(() => {
    const defaultSlot = slots.default?.();

    if (defaultSlot?.[0]) {
      return defaultSlot[0].children!.toString();
    }

    return undefined;
  });
</script>

<template>
  <div class="acv-chip">
    <AcvIcon
      v-if="iconName"
      class="acv-chip__icon"
      :name="iconName"
      color="primary"
    />
    <span
      class="acv-chip__text"
      :title="title"
    >
      <slot />
    </span>
    <!--    <div class="i-acronis-icons:user--32" /> -->
    <div class="i-vscode-icons:file-type-light-pnpm" />

    <AcvButton
      v-if="showClose"
      icon="i-times--16"
      type="ghost"
      class="acv-chip__close-button m-8 bg-red:10"
      @click="$emit('close')"
    />
  </div>
</template>

<style scoped>
  .acv-chip {
    color: var(--acv-chip-color);
    height: var(--acv-chip-height);
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    vertical-align: middle;
    padding: 0 0 0 12px;
    text-align: center;
    border-radius: calc(var(--acv-chip-height) * .5);
    position: relative;
    background-color: var(--acv-color-accent-light);
    border: var(--acv-border-sm) var(--acv-color-primary-light);
    font-size: var(--acv-font-size-body); /* 16px */
    font-weight: var(--acv-font-weight-regular);
    line-height: var(--acv-font-line-height-regular);

    .acv-chip__text {
      display: inline-block;
      max-width: 223px;
      vertical-align: top;
      padding-right: 12px;

      /* ellipsis */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }

    .acv-chip__icon {
      margin-right: 8px;
    }

    .acv-chip__close-button {
      margin-left: 8px;
    }

    &+& {
      margin-left: 8px;
    }
  }
</style>
