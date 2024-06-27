<script setup lang="ts">
  import { computed } from 'vue';
  import { isInteger } from '@acronis-platform/utils';
  import './divider.css';
  import { isNumber } from 'lodash-es';
  import type { DividerProps } from './divider.ts';

  defineOptions({ name: 'Divider' });

  const { vertical, textPosition, color, margin } = defineProps<DividerProps>();

  const slots = defineSlots<{ default: () => any }>();
  const hasText = computed(() => !!slots.default);

  const height = computed(() => {
    return isInteger(vertical) ? vertical : null;
  });

  const dividerClasses = computed(() => {
    return {
      'acv-divider': true,
      [`acv-divider--color-${color}`]: color,
      'acv-divider--vertical': vertical,
      'acv-divider--horizontal': !vertical,
      'acv-divider--with-text': !vertical && hasText.value,
      [`acv-divider--with-text-${textPosition}`]:
        textPosition && !vertical && hasText.value && textPosition !== 'center'
    };
  });
  const textMargin = computed(() => isNumber(margin) ? `${margin}px` : margin);

  const dividerStyles = computed(() => {
    return {
      height: `${height.value}px`,
      ...(textMargin.value && vertical
        ? {
          marginRight: textMargin.value,
          marginLeft: textMargin.value
        }
        : {
          marginTop: textMargin.value,
          marginBottom: textMargin.value
        })
    };
  });
</script>

<template>
  <div
    :class="dividerClasses"
    :style="dividerStyles"
    role="separator"
  >
    <span
      v-if="!vertical && hasText"
      class="acv-divider__text"
    >
      <slot />
    </span>
  </div>
</template>

<style scoped>
  .acv-divider {
    display: flex;
    padding: 0;
    border-top: var(--acv-divider-border);

    &.acv-divider--color-brand {
      background-color: var(--acv-color-brand-primary);
    }

    &.acv-divider--color-accent{
      background-color: var(--acv-color-brand-tertiary);
    }

    &.acv-divider--color-secondary {
      background-color: var(--acv-color-brand-secondary);
    }

    &.acv-divider--horizontal {
      width: 100%;
      margin: var(--acv-divider-v-margin) 0;
      clear: both;
    }

    &.acv-divider--vertical {
      position: relative;
      display: inline-block;
      height: 14px;
      margin: 0 var(--acv-divider-h-margin);
      vertical-align: middle;
      border-inline-start: var(--acv-divider-border);
      border-top: 0;
    }

    &.acv-divider--with-text {
      margin: var(--acv-divider-v-margin-text) 0;
      text-align: center;
      white-space: nowrap;
      border-top: 0;

      &:before,
      &:after {
        position: relative;
        top: 50%;
        width: 50%;
        content: '';
        border-top: var(--acv-divider-border);
        transform: translateY(50%);
      }
    }

    &.acv-divider--with-text-left {
      &:before {
        width: 5%;
      }

      &:after {
        width: 95%;
      }
    }

    &.acv-divider--with-text-right {
      &:before {
        width: 95%;
      }

      &:after {
        width: 5%;
      }
    }

    &.acv-divider--dashed {
      &,
      &:before,
      &:after {
        border-top-style: dashed;
      }
    }

    &.acv-divider__text {
      display: inline-block;
      padding: var(--acv-divider-text-v-padding) var(--acv-divider-text-h-padding);
      color: var(--acv-divider-text-color);
      text-align: center;
      white-space: nowrap;
    }

    &.acv-divider--primary .acv-divider__text {
      font-size: var(--acv-divider-text-size-primary);
      font-weight: 500;
    }
  }
</style>
