<script setup lang="ts">
  import { computed, defineAsyncComponent, markRaw, ref, useAttrs, watch } from 'vue';
  import { camelCase, startCase } from 'lodash-es';
  import { isBrowser } from '@antfu/utils';
  import type { AcvIconProps } from './icon.ts';

  import './icon.css';

  const {
    animateOnHover,
    animation,
    animationSpeed,
    color,
    flip,
    icon,
    inverse,
    name,
    size,
    state,
    stateColor,
    title,
  } = withDefaults(defineProps<AcvIconProps>(), {
    collection: 'acronis',
    size: '16'
  });

  const classes = computed(() => {
    return {
      'acv-icon': true,
      'is-inverse': inverse,
      [`flip-${flip}`]: !!flip,
      [`color-${color}`]: !!color,
      [`animation-${animation}`]: !!animation,
      [`size-${size}`]: size,
      [`speed-${animationSpeed}`]: !!animationSpeed,
      'acv-icon-hover': animateOnHover,
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
    return stateColor ? `var(--acv-color-${stateColor})` : 'currentColor';
  });

  const dynamicIcon = ref<any>(null);
  const dynamicStateIcon = ref<any>(null);

  watch(() => name, async () => {
    if (!name || !isBrowser) {
      return undefined;
    }
    const iconFilename = `Icon${startCase(camelCase(name)).replace(/ /g, '')}`;
    const iconModule = () => import(`./../../../../icons/vue/${iconFilename}.js`);

    dynamicIcon.value = iconModule ? markRaw(defineAsyncComponent(await iconModule)) : null;
  }, { immediate: true });

  watch(() => state, async () => {
    if (!state || !isBrowser) {
      return undefined;
    }
    const iconFilename = `Icon${startCase(camelCase(state)).replace(/ /g, '')}`;
    const iconModule = () => import(`../../../../icons/vue/${iconFilename}.js`);

    dynamicStateIcon.value = iconModule ? markRaw(defineAsyncComponent(await iconModule)) : null;
  }, { immediate: true });
</script>

<template>
  <i
    :class="classes"
    v-bind="attrs"
  >
    <g v-if="icon && !name">
      <slot>
        <component
          :is="icon"
          v-if="icon"
          :color="stateColor"
          preserveAspectRatio="xMidYMid meet"
        />
      </slot>
    </g>
    <template v-else>
      <suspense>
        <component
          :is="dynamicIcon"
          v-if="dynamicIcon"
          class="cmp"
          :width="size"
          :height="size"
        />
      </suspense>
      <suspense>
        <component
          :is="dynamicStateIcon"
          v-if="dynamicStateIcon"
          class="state"
          :width="size"
          :height="size"
        /></suspense>
    </template>
  </i>
</template>

<style scoped>
  .acv-icon {
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
    justify-content: center;

    svg {
      fill: v-bind(fillColor);
      color: v-bind(fillColor);
      height: var(--acv-icon-size);
      width: var(--acv-icon-size);
    }

    &.size-xs,
    &.size-16
    {
      --acv-icon-size: var(--acv-icon-size-xs);
    }

    &.size-sm,
    &.size-20 {
      --acv-icon-size: var(--acv-icon-size-sm);
    }

    &.size-md,
    &.size-24 {
      --acv-icon-size: var(--acv-icon-size-md);
    }

    &.size-lg,
    &.size-32 {
      --acv-icon-size: var(--acv-icon-size-lg);
    }

    &.size-xl,
    &.size-48 {
      --acv-icon-size: var(--acv-icon-size-xl);
    }

    &.size-xxl,
    &.size-64 {
      --acv-icon-size: var(--acv-icon-size-2xl);
    }

    &.size-xxxl,
    &.size-96 {
      --acv-icon-size: var(--acv-icon-size-3xl);
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

    &.state {
      position: absolute;
      top: 0;
      left: 0;
      color: v-bind(fillStateColor);
      fill: v-bind(fillStateColor);
    }
  }

/* ---------------- spin ---------------- */

.animation-spin:not(.acv-icon-hover),
.animation-spin.acv-icon-hover:hover,
.animation-parent.acv-icon-hover:hover > .animation-spin {
    animation: animation-spin 1s linear infinite;
}

.animation-spin:not(.acv-icon-hover).acv-icon-fast,
.animation-spin.acv-icon-hover.acv-icon-fast:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-spin.acv-icon-fast {
    animation: animation-spin 0.7s linear infinite;
}

.animation-spin:not(.acv-icon-hover).acv-icon-slow,
.animation-spin.acv-icon-hover.acv-icon-slow:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-spin.acv-icon-slow {
    animation: animation-spin 2s linear infinite;
}

/* ---------------- spin-pulse ---------------- */

.animation-spin-pulse:not(.acv-icon-hover),
.animation-spin-pulse.acv-icon-hover:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-spin-pulse {
    animation: animation-spin 1s infinite steps(8);
}

.animation-spin-pulse:not(.acv-icon-hover).acv-icon-fast,
.animation-spin-pulse.acv-icon-hover.acv-icon-fast:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-spin-pulse.acv-icon-fast {
    animation: animation-spin 0.7s infinite steps(8);
}

.animation-spin-pulse:not(.acv-icon-hover).acv-icon-slow,
.animation-spin-pulse.acv-icon-hover.acv-icon-slow:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-spin-pulse.acv-icon-slow {
    animation: animation-spin 2s infinite steps(8);
}

/* ---------------- wrench ---------------- */

.animation-wrench:not(.acv-icon-hover),
.animation-wrench.acv-icon-hover:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-wrench {
    animation: animation-wrench 2.5s ease infinite;
}

.animation-wrench:not(.acv-icon-hover).acv-icon-fast,
.animation-wrench.acv-icon-hover.acv-icon-fast:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-wrench.acv-icon-fast {
    animation: animation-wrench 1.2s ease infinite;
}

.animation-wrench:not(.acv-icon-hover).acv-icon-slow,
.animation-wrench.acv-icon-hover.acv-icon-slow:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-wrench.acv-icon-slow {
    animation: animation-wrench 3.7s ease infinite;
}

/* ---------------- ring ---------------- */

.animation-ring:not(.acv-icon-hover),
.animation-ring.acv-icon-hover:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-ring {
    animation: animation-ring 2s ease infinite;
}

.animation-ring:not(.acv-icon-hover).acv-icon-fast,
.animation-ring.acv-icon-hover.acv-icon-fast:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-ring.acv-icon-fast {
    animation: animation-ring 1s ease infinite;
}

.animation-ring:not(.acv-icon-hover).acv-icon-slow,
.animation-ring.acv-icon-hover.acv-icon-slow:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-ring.acv-icon-slow {
    animation: animation-ring 3s ease infinite;
}

/* ---------------- pulse ---------------- */

.animation-pulse:not(.acv-icon-hover),
.animation-pulse.acv-icon-hover:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-pulse {
    animation: animation-pulse 2s linear infinite;
}

.animation-pulse:not(.acv-icon-hover).acv-icon-fast,
.animation-pulse.acv-icon-hover.acv-icon-fast:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-pulse.acv-icon-fast {
    animation: animation-pulse 1s linear infinite;
}

.animation-pulse:not(.acv-icon-hover).acv-icon-slow,
.animation-pulse.acv-icon-hover.acv-icon-slow:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-pulse.acv-icon-slow {
    animation: animation-pulse 3s linear infinite;
}

/* ---------------- flash ---------------- */

.animation-flash:not(.acv-icon-hover),
.animation-flash.acv-icon-hover:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-flash {
    animation: animation-flash 2s ease infinite;
}

.animation-flash:not(.acv-icon-hover).acv-icon-fast,
.animation-flash.acv-icon-hover.acv-icon-fast:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-flash.acv-icon-fast {
    animation: animation-flash 1s ease infinite;
}

.animation-flash:not(.acv-icon-hover).acv-icon-slow,
.animation-flash.acv-icon-hover.acv-icon-slow:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-flash.acv-icon-slow {
    animation: animation-flash 3s ease infinite;
}

/* ---------------- float ---------------- */

.animation-float:not(.acv-icon-hover),
.animation-float.acv-icon-hover:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-float {
    animation: animation-float 2s linear infinite;
}

.animation-float:not(.acv-icon-hover).acv-icon-fast,
.animation-float.acv-icon-hover.acv-icon-fast:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-float.acv-icon-fast {
    animation: animation-float 1s linear infinite;
}

.animation-float:not(.acv-icon-hover).acv-icon-slow,
.animation-float.acv-icon-hover.acv-icon-slow:hover,
.acv-icon-parent.acv-icon-hover:hover > .animation-float.acv-icon-slow {
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
