<script lang="ts" setup>
  import { computed, toRef } from 'vue';
  import './card.css';
  import type { AcvCardProps, AcvCardSlots } from './card.ts';
  import { useLayer } from '@/composables/useLayer.ts';
  import AcvLoader from '@/components/loader/loader.vue';
  import { isBaseColor } from '@/utils/color.ts';

  defineOptions({
    name: 'AcvCard'
  });
  const props = withDefaults(defineProps<AcvCardProps>(), {
    shadow: true,
    border: true,
    padding: true,
    round: true,
  });
  defineEmits<{
    close: []
  }>();

  defineSlots<AcvCardSlots>();

  const { layerClasses, layerStyles } = useLayer({
    propColor: toRef(props, 'color'),
    propVariant: toRef(props, 'variant'),
    propStates: toRef(props, 'states'),
  });

  const cardClasses = computed(() => {
    return {
      'acv-card': true,
      'shadowed': props.shadow,
      'rounded': props.round,
      'bordered': props.border,
      'padded': props.padding,
    };
  });

  // TODO move to layer (border, background, color)
  const cardStyles = computed(() => {
    return {
      ...(props.borderColor && isBaseColor(props.borderColor) && {
        border: `1px solid var(--acv-color-${props.borderColor})`
      }),
      ...(props.backgroundColor && isBaseColor(props.backgroundColor) && {
        backgroundColor: `var(--acv-color-${props.backgroundColor})`
      })
    };
  });
</script>

<template>
  <div
    :class="[layerClasses, cardClasses]"
    :style="[cardStyles, layerStyles]"
  >
    <slot name="loading">
      <div
        v-if="loading"
        class="acv-card-loading"
      >
        <AcvLoader />
      </div>
    </slot>
    <img
      v-if="props.img"
      class="img"
      :src="props.img"
      :alt="props.imgAlt"
    >
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .acv-card {
    font-weight: var(--acv-font-weight-regular);
    background-clip: padding-box;
    overflow: hidden;
    font-size: var(--acv-font-size-body);
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: [full-start] var(--acv-card-padding) [content-start] 1fr [content-end] var(--acv-card-padding) [full-end];
    padding-block: var(--acv-card-padding);

    & > *,
    .content {
      grid-column: content;
    }

    & > :deep(img) {
      grid-column: full;
      margin-block: 16px;
      width:100%;
    }

    &.rounded {
      border-radius: var(--acv-radius-regular);
    }

    &.shadowed {
      box-shadow: var(--acv-shadow-regular);
    }

    &.padded {
      --acv-card-padding: var(--acv-spacing-regular);
    }

    & :deep(.acv-card-padding) {
      padding: var(--acv-card-padding);
    }
  }

  .acv-card--modal {
    box-shadow: var(--acv-shadow-modal);
    border: none;
  }

  .acv-card-background-white {
    background-color: var(--acv-color-white);
  }

  .acv-card-border-brand {
    background-color: var(--acv-color-brand-primary);
  }

  .acv-card-border-success {
    background-color: var(--acv-color-status-success-secondary);
  }

  .acv-card-border-warning {
    background-color: var(--acv-color-status-warning-secondary);
  }

  .acv-card-border-danger {
    background-color: var(--acv-color-status-danger-secondary);
  }
</style>
