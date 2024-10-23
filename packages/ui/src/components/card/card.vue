<script lang="ts" setup>
  import type { AcvCardProps, AcvCardSlots } from './card.ts';

  defineOptions({ name: 'AcvCard' });
  defineProps<AcvCardProps>();
  defineSlots<AcvCardSlots>();
</script>

<template>
  <div
    class="acv-card"
    :class="{
      padded: withPadding,
      [`shadow shadow_${shadow}`]: !!shadow,
      [`border border_${border}`]: !!border,
    }"
  >
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.acv-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-clip: padding-box;
  border-radius: var(--acv-card-radius, var(--acv-radius-regular));
  padding-block: var(--acv-card-padding);
  padding-inline: var(--acv-card-padding);

  &.border {
    border: 1px solid
      var(--acv-card-border-color, var(--acv-color-form-secondary));

    &.border_active {
      --acv-card-border-color: var(--acv-color-form-active);
    }

    &.border_secondary {
      --acv-card-border-color: var(--acv-color-form-secondary);
    }
  }

  &.shadow {
    box-shadow: var(--acv-card-shadow, var(--acv-shadow-regular));

    &.shadow_regular {
      --acv-card-shadow: var(--acv-shadow-regular);
    }

    &.shadow_modal {
      --acv-card-shadow: var(--acv-shadow-modal);
    }
  }

  &.padded {
    --acv-card-padding: var(--acv-spacing-large);
  }
}
</style>
