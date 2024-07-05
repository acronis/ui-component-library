<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import type { AcvChipProps } from '../../components/index';
  import { AcvButton, Icon } from '../../components/index';
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
    <Icon
      v-if="iconName"
      class="acv-chip__icon"
      :name="iconName"
      color="primary"
    />
    <span
      class="acv-chip__text"
      :title="title"
    >
      <slot></slot>
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

<style scoped lang="scss">
  @import '../../styles/mixins/typography.scss';

  .acv-chip {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-chip-color);
    height: var(--acv-chip-height);
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    vertical-align: middle;
    padding: 0 0 0 12px;
    text-align: center;
    line-height: var(--acv-chip-height);
    border-radius: calc(var(--acv-chip-height) * .5);
    position: relative;
    background-color: var(--acv-color-accent-light);
    border: var(--acv-border-sm) var(--acv-color-primary-light);

    .acv-chip__text {
      display: inline-block;
      max-width: 223px;
      vertical-align: top;
      padding-right: 12px;

      @include ellipsis;
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

    @include text-body;
  }
</style>
