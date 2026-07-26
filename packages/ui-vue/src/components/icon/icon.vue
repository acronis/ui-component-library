<script setup lang="ts">
  import type { Component } from 'vue';
  import type { AcvIconProps, AcvIconSource } from './icon.ts';
  import { computed, markRaw, onBeforeMount, ref, useAttrs } from 'vue';
  import { ICON_SIZES } from './icon.ts';
  import iconPaths from './iconPaths';

  defineOptions({
    name: 'AcvIcon',
  });

  const {
    animateOnHover,
    animation,
    animationSpeed,
    color,
    disabled,
    flip,
    inverse,
    left,
    name,
    right,
    size = 'small',
    source,
    state,
    stateColor,
    title,
  } = defineProps<AcvIconProps>();
  const svgComponent = ref<Component | null>(null);

  const svgStateComponent = ref<Component | null>(null);

  const dynamicFilePath = computed(() => {
    if (!source && name) {
      return name.replace('i-', '');
    }

    return name;
  });

  const dynamicStateFilePath = computed(() => {
    if (!state)
      return;

    if (!source && state && typeof state === 'string') {
      return state.replace('i-', '');
    }

    return state;
  });

  const sourceType = computed<AcvIconSource>(() => {
    // Because of svgLoader so we need to check if the source is a function AND an object
    const functionTypes = ['function', 'object'];

    if (functionTypes.includes(typeof source)) {
      return 'function';
    }

    if (dynamicFilePath.value) {
      return 'dynamic';
    }

    return source === 'placeholder' ? 'placeholder' : 'external';
  });

  onBeforeMount(() => {
    getIconSrc();
  });

  async function getIconSrc() {
    if (!dynamicFilePath.value)
      return;

    const normalizedIcons = Object.keys(iconPaths).reduce((acc, value) => {
      const match = value?.match(/([^/]+)\.svg$/);

      if (match) {
        const name = match[1];
        acc[name] = iconPaths[value];
      }

      return acc;
    }, {});

    const iconPath = normalizedIcons?.[dynamicFilePath.value];
    const iconStatePath = typeof dynamicStateFilePath.value === 'string' && normalizedIcons?.[dynamicStateFilePath.value];

    if (typeof iconPath === 'function') {
      svgComponent.value = markRaw((await iconPath()).default);
    }
    if (typeof iconStatePath === 'function') {
      svgStateComponent.value = markRaw((await iconStatePath()).default);
    }
  }

  const iconSizeValue = computed(() => {
    const isNumber = Number(size);
    if (!ICON_SIZES[size] && isNumber) {
      return `${isNumber}px`;
    }

    return `${size ? ICON_SIZES[size] : ICON_SIZES.small}px`;
  });

  const classes = computed(() => {
    return {
      'acv-custom-icon': true,
      'is-inverse': inverse,
      'is-disabled': disabled,
      'is-right': right,
      'is-left': left,
      [`flip-${flip}`]: !!flip,
      [`color-${color}`]: !!color,
      [`animation-${animation}`]: !!animation,
      [`size-${size}`]: size,
      [`speed-${animationSpeed}`]: !!animationSpeed,
      'hover': animateOnHover,
    };
  });

  const attrs = {
    ...useAttrs(),
    'role': (title ? 'img' : 'presentation'),
    'aria-label': title || undefined,
  };
  const fillColor = computed(() => {
    return color ? `var(--acv-color-${color})` : 'currentColor';
  });
  const fillStateColor = computed(() => {
    return stateColor ? `var(--acv-color-${stateColor})` : undefined;
  });
</script>

<template>
  <i
    :class="classes"
    v-bind="attrs"
  >
    <component
      :is="svgStateComponent"
      v-if="sourceType === 'dynamic'"
      class="state"
    />
    <component
      :is="svgComponent"
      v-if="sourceType === 'dynamic'"
    />
    <component
      :is="source"
      v-if="sourceType === 'function'"
      class="is-svg"
      focusable="false"
      aria-hidden="true"
    />
    <span
      v-if="sourceType === 'placeholder'"
      class="is-placeholder"
    />
    <img
      v-if="sourceType === 'external'"
      alt=""
      class="is-img"
      :src="`data:image/svg+xml;utf8,${source}`"
      :aria-hidden="true"
    >
    <span class="visually-hidden">{{ name }}</span>
  </i>
</template>

<style scoped>
  .acv-custom-icon {
    --acv-icon-size: v-bind(iconSizeValue);
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-icon-color);
    flex-shrink: 0;
    block-size: var(--acv-icon-size);
    inline-size: var(--acv-icon-size);
    font-size: var(--acv-icon-size);
    position: relative;
    display: inline-flex;
    align-items: center;
    align-self: center;
    max-height: 100%;
    max-width: 100%;
    justify-content: center;

    svg:not(.state) {
      fill: v-bind(fillColor);
      color: v-bind(fillColor);
      height: var(--acv-icon-size);
      width: var(--acv-icon-size);
    }

    &.size-xs,
    &.size-16
    {
      --acv-icon-size: var(--acv-icon-size-x-small);
    }

    &.size-sm,
    &.size-20 {
      --acv-icon-size: var(--acv-icon-size-small);
    }

    &.size-md,
    &.size-24 {
      --acv-icon-size: var(--acv-icon-size-medium);
    }

    &.size-lg,
    &.size-32 {
      --acv-icon-size: var(--acv-icon-size-large);
    }

    &.size-xl,
    &.size-48 {
      --acv-icon-size: var(--acv-icon-size-x-large);
    }

    &.size-xxl,
    &.size-64 {
      --acv-icon-size: var(--acv-icon-size-xx-large);
    }

    &.size-xxxl,
    &.size-96 {
      --acv-icon-size: var(--acv-icon-size-xxx-large);
    }

    &.is-disabled {
      color: var(--acv-color-button-disabled);
    }

    .is-svg,
    .is-img {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
    }

    .is-placeholder {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: var(--acv-color-brand-primary);
      border-radius: var(--acv-base-radius-04);
    }

    &.flip-horizontal {
         transform: scale(-1, 1);
       }

    &.flip-vertical {
      transform: scale(1, -1);
    }

    &.flip-both {
      transform: scale(-1, -1);
    }

    &.is-inverse {
      color: var(--acv-color-inverted);
    }

    .state {
      position: absolute;
      top: 0;
      left: 0;
       color: v-bind(fillStateColor);

       /* fill: v-bind(fillStateColor); */
    }
  }

/* ---------------- spin ---------------- */

.animation-spin:not(.hover),
.animation-spin.hover:hover,
.animation-parent.hover:hover > .animation-spin {
    animation: animation-spin 1s linear infinite;
}

.animation-spin:not(.hover).acv-icon-fast,
.animation-spin.hover.acv-icon-fast:hover,
.acv-icon-parent.hover:hover > .animation-spin.acv-icon-fast {
    animation: animation-spin 0.7s linear infinite;
}

.animation-spin:not(.hover).acv-icon-slow,
.animation-spin.hover.acv-icon-slow:hover,
.acv-icon-parent.hover:hover > .animation-spin.acv-icon-slow {
    animation: animation-spin 2s linear infinite;
}

/* ---------------- spin-pulse ---------------- */

.animation-spin-pulse:not(.hover),
.animation-spin-pulse.hover:hover,
.acv-icon-parent.hover:hover > .animation-spin-pulse {
    animation: animation-spin 1s infinite steps(8);
}

.animation-spin-pulse:not(.hover).acv-icon-fast,
.animation-spin-pulse.hover.acv-icon-fast:hover,
.acv-icon-parent.hover:hover > .animation-spin-pulse.acv-icon-fast {
    animation: animation-spin 0.7s infinite steps(8);
}

.animation-spin-pulse:not(.hover).acv-icon-slow,
.animation-spin-pulse.hover.acv-icon-slow:hover,
.acv-icon-parent.hover:hover > .animation-spin-pulse.acv-icon-slow {
    animation: animation-spin 2s infinite steps(8);
}

/* ---------------- wrench ---------------- */

.animation-wrench:not(.hover),
.animation-wrench.hover:hover,
.acv-icon-parent.hover:hover > .animation-wrench {
    animation: animation-wrench 2.5s ease infinite;
}

.animation-wrench:not(.hover).acv-icon-fast,
.animation-wrench.hover.acv-icon-fast:hover,
.acv-icon-parent.hover:hover > .animation-wrench.acv-icon-fast {
    animation: animation-wrench 1.2s ease infinite;
}

.animation-wrench:not(.hover).acv-icon-slow,
.animation-wrench.hover.acv-icon-slow:hover,
.acv-icon-parent.hover:hover > .animation-wrench.acv-icon-slow {
    animation: animation-wrench 3.7s ease infinite;
}

/* ---------------- ring ---------------- */

.animation-ring:not(.hover),
.animation-ring.hover:hover,
.acv-icon-parent.hover:hover > .animation-ring {
    animation: animation-ring 2s ease infinite;
}

.animation-ring:not(.hover).acv-icon-fast,
.animation-ring.hover.acv-icon-fast:hover,
.acv-icon-parent.hover:hover > .animation-ring.acv-icon-fast {
    animation: animation-ring 1s ease infinite;
}

.animation-ring:not(.hover).acv-icon-slow,
.animation-ring.hover.acv-icon-slow:hover,
.acv-icon-parent.hover:hover > .animation-ring.acv-icon-slow {
    animation: animation-ring 3s ease infinite;
}

/* ---------------- pulse ---------------- */

.animation-pulse:not(.hover),
.animation-pulse.hover:hover,
.acv-icon-parent.hover:hover > .animation-pulse {
    animation: animation-pulse 2s linear infinite;
}

.animation-pulse:not(.hover).acv-icon-fast,
.animation-pulse.hover.acv-icon-fast:hover,
.acv-icon-parent.hover:hover > .animation-pulse.acv-icon-fast {
    animation: animation-pulse 1s linear infinite;
}

.animation-pulse:not(.hover).acv-icon-slow,
.animation-pulse.hover.acv-icon-slow:hover,
.acv-icon-parent.hover:hover > .animation-pulse.acv-icon-slow {
    animation: animation-pulse 3s linear infinite;
}

/* ---------------- flash ---------------- */

.animation-flash:not(.hover),
.animation-flash.hover:hover,
.acv-icon-parent.hover:hover > .animation-flash {
    animation: animation-flash 2s ease infinite;
}

.animation-flash:not(.hover).acv-icon-fast,
.animation-flash.hover.acv-icon-fast:hover,
.acv-icon-parent.hover:hover > .animation-flash.acv-icon-fast {
    animation: animation-flash 1s ease infinite;
}

.animation-flash:not(.hover).acv-icon-slow,
.animation-flash.hover.acv-icon-slow:hover,
.acv-icon-parent.hover:hover > .animation-flash.acv-icon-slow {
    animation: animation-flash 3s ease infinite;
}

/* ---------------- float ---------------- */

.animation-float:not(.hover),
.animation-float.hover:hover,
.acv-icon-parent.hover:hover > .animation-float {
    animation: animation-float 2s linear infinite;
}

.animation-float:not(.hover).acv-icon-fast,
.animation-float.hover.acv-icon-fast:hover,
.acv-icon-parent.hover:hover > .animation-float.acv-icon-fast {
    animation: animation-float 1s linear infinite;
}

.animation-float:not(.hover).acv-icon-slow,
.animation-float.hover.acv-icon-slow:hover,
.acv-icon-parent.hover:hover > .animation-float.acv-icon-slow {
    animation: animation-float 3s linear infinite;
}

@keyframes animation-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes animation-wrench {
    0% {
        transform: rotate(-12deg);
    }

    8% {
        transform: rotate(12deg);
    }

    10%, 28%, 30%, 48%, 50%, 68% {
        transform: rotate(24deg);
    }

    18%, 20%, 38%, 40%, 58%, 60% {
        transform: rotate(-24deg);
    }

    75%, 100% {
        transform: rotate(0deg);
    }
}

@keyframes animation-ring {
    0% {
        transform: rotate(-15deg);
    }

    2% {
        transform: rotate(15deg);
    }

    4% {
        transform: rotate(-18deg);
    }

    6% {
        transform: rotate(18deg);
    }

    8% {
        transform: rotate(-22deg);
    }

    10% {
        transform: rotate(22deg);
    }

    12% {
        transform: rotate(-18deg);
    }

    14% {
        transform: rotate(18deg);
    }

    16% {
        transform: rotate(-12deg);
    }

    18% {
        transform: rotate(12deg);
    }

    20%, 100% {
        transform: rotate(0deg);
    }
}

@keyframes animation-pulse {
    0% {
        transform: scale(1.1);
    }

    50% {
        transform: scale(0.8);
    }

    100% {
        transform: scale(1.1);
    }
}

@keyframes animation-flash {
    0%, 100%, 50%{
        opacity: 1;
    }

    25%, 75%{
        opacity: 0;
    }
}

@keyframes animation-float {
    0%, 100% {
        transform: translateY(-3px);
    }

    50% {
        transform: translateY(3px);
    }
}
</style>
