<script setup lang="ts">
  import type { AcvAsideEvents, AcvAsideProps, AcvAsideSlots } from './aside.ts';
  import { computed, watch } from 'vue';
  import { isBaseColor } from '../../utils/color.ts';
  import './aside.css';

  defineOptions({
    name: 'AcvAside',
    inheritAttrs: false
  });

  const props = withDefaults(defineProps<AcvAsideProps>(), {
    anchor: 'left',
    position: 'static',
    modelValue: true,
    collapsible: false,
    persistent: false,
    elevation: false,
    animated: true,
    responsive: true
  });

  const emit = defineEmits<AcvAsideEvents>();
  const slots = defineSlots<AcvAsideSlots>();

  // Width/Height calculations
  const dimensionPx = computed(() => {
    if (!props.width) return '';
    // Match valid CSS units: px, %, em, rem, vw, vh, vmin, vmax, ch, ex, cm, mm, in, pt, pc, q
    const cssUnitPattern = /^-?\d*\.?\d+\s*(px|%|em|rem|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc|q)$/i;
    return cssUnitPattern.test(props.width.trim())
      ? props.width
      : `${props.width}px`;
  });

  // Background color
  const backgroundColor = computed(() => (
    props.color && isBaseColor(props.color)
      ? `var(--acv-color-${props.color})`
      : ''
  ));

  // CSS classes
  const asideClasses = computed(() => {
    return {
      'acv-aside': true,
      [`acv-aside--anchor-${props.anchor}`]: props.anchor,
      [`acv-aside--position-${props.position}`]: props.position,
      [`acv-aside--color-${props.color}`]: props.color && isBaseColor(props.color),
      'acv-aside--collapsible': props.collapsible,
      'acv-aside--collapsed': props.collapsible && !props.modelValue,
      'acv-aside--elevation': props.elevation,
      'acv-aside--animated': props.animated,
      'acv-aside--responsive': props.responsive,
      [props.customClass || '']: !!props.customClass
    };
  });

  // Toggle functionality
  const toggle = () => {
    if (props.collapsible) {
      const newValue = !props.modelValue;
      emit('update:modelValue', newValue);
      emit('toggle', newValue);
      
      if (newValue) {
        emit('open');
      } else {
        emit('close');
      }
    }
  };

  // Watch for model value changes to emit events
  watch(() => props.modelValue, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (newValue) {
        emit('open');
      } else {
        emit('close');
      }
    }
  });

  // Expose toggle method
  defineExpose({
    toggle
  });
</script>

<template>
  <aside
    v-show="!props.collapsible || props.modelValue"
    :class="asideClasses"
    :style="{ 
      '--acv-aside-dimension': dimensionPx,
      '--acv-aside-bg-color': backgroundColor
    }"
    :aria-label="props.ariaLabel"
    :aria-labelledby="props.ariaLabelledby"
    role="complementary"
    v-bind="$attrs"
  >
    <!-- Header slot -->
    <header
      v-if="slots.header"
      class="acv-aside__header"
    >
      <slot name="header" />
    </header>

    <!-- Main content -->
    <div class="acv-aside__content">
      <slot />
    </div>

    <!-- Footer slot -->
    <footer
      v-if="slots.footer"
      class="acv-aside__footer"
    >
      <slot name="footer" />
    </footer>
  </aside>
</template>


