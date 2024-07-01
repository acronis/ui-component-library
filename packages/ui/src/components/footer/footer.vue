<script setup lang="ts">
  import { computed } from 'vue';
  import { isColor } from '../../utils/color.ts';
  import type { FooterProps, FooterSlots } from './footer.ts';
  import './footer.css';

  const { height, color } = withDefaults(defineProps<FooterProps>(), {
    height: '64px',
    color: 'white',
  });

  defineSlots<FooterSlots>();

  // const { isColorModifier } = useColor(['nav-primary']);

  const backgroundColor = computed(() => (
    color && !isColor(color)
      ? `var(--acv-color-${color})`
      : null
  ));
  const footerClasses = computed(() => {
    return {
      'acv-footer': true,
      [`acv-footer--color-${color}`]: isColor(color),
    };
  });
</script>

<template>
  <footer :class="footerClasses">
    <div class="acv-footer__content">
      <slot />
    </div>
    <div>
      <slot name="aside" />
    </div>
  </footer>
</template>

<style scoped>
  .acv-footer {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-footer-color);
    height: v-bind(height);
    background-color: v-bind(backgroundColor);

    .acv-footer__content {
      flex: 1;
    }

    .acv-footer--color-primary-lightest {
      background-color: var(--acv-color-primary-lightest);
    }

    .acv-footer--color-fixed-white {
      background-color: var(--acv-color-white);
    }
  }
</style>
