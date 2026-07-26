<script setup>
  import { LAYER_VARIANT } from '@/composables/useLayer.ts';
  import { BASE_COLORS } from '@/utils/color.ts';

  const layerStates = [
    '',
    'hover',
    'active',
    'focus',
    'disabled'
  ];
</script>

<template>
  <div
    v-for="color in BASE_COLORS"
    :key="color"
    class="acv-grid-row acv-grid--cols-5"
  >
    <div
      v-for="state in layerStates"
      :key="state"
      class="acv-layer"
      :class="{
        'acv-bg-surface-fixed-primary pa-8': color === BASE_COLORS.inverted,
      }"
    >
      <div
        v-for="variant in LAYER_VARIANT"
        :key="variant + state"
        class="acv-layer"
        :class="{
          [variant]: variant,
          [state]: state,
          [color]: color,
        }"
        :style="{ '--acv-layer-color': `var(--acv-color-${color})` }"
      >
        {{ variant }} {{ color }} {{ state }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .acv-layer {
    width: 100%;
    line-height: 48px;
    padding-inline: 16px;
    padding-block: 16px;
  }
</style>
