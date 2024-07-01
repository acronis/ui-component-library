<script setup lang="ts">
  import { computed } from 'vue';
  import AcvPopper from '../popper/popper.vue';
  import type { AcvTooltipProps, AcvTooltipSlots } from './tooltip.ts';

  import './tooltip.css';

  defineOptions({
    name: 'AcvTooltip'
  });

  const props = withDefaults(
    defineProps<AcvTooltipProps>(),
    {
      trigger: 'hover',
      placement: 'top',
      arrow: true,
      offset: 6
    }
  );

  defineSlots<AcvTooltipSlots>();

  const maxWidth = computed(() => {
    return props.maxWidth ? `${props.maxWidth}px` : undefined;
  });
</script>

<template>
  <AcvPopper
    v-bind="{ ...props }"
    style="margin:30px"
  >
    <slot />
    <template #content>
      <div
        class="acv-tooltip"
      >
        <slot name="content">
          {{ props.content }}
        </slot>
      </div>
    </template>
    <template #arrow="{ side }">
      <i
        class="triangle"
        :class="side"
      ></i>
    </template>
  </AcvPopper>
</template>

<style scoped>
  .acv-tooltip {
    position: relative;
    z-index: var(--acv-z-index-tooltip);
    font-size: var(--acv-font-size-caption);
    color: var(--acv-color-text-inversed-primary);
    background-color: var(--acv-color-black);
    padding-block: 16px;
    padding-inline: 16px;
    box-shadow: var(--acv-box-shadow) var(--acv-color-effect-shadow-primary);
    border-radius: var(--acv-radius-regular, 4px);
    width: v-bind(maxWidth);
    max-width: max-content;
  }

  .triangle {
    width: 0;
    height: 0;
    display: block;

    &.top {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 6px solid var(--acv-color-black);
    }

    &.bottom {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid var(--acv-color-black);
    }

    &.left {
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right:6px solid  var(--acv-color-black);
    }

    &.right {
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left:6px solid  var(--acv-color-black);
    }
  }
</style>
