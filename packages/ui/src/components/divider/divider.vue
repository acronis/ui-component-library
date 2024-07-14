<script setup lang="ts">
  import { computed, toRefs } from 'vue';
  import { isNumber } from 'lodash-es';
  import './divider.css';
  import type { AcvDividerProps } from './divider.ts';

  defineOptions({ name: 'Divider' });

  const props = defineProps<AcvDividerProps>();

  const slots = defineSlots<{ default: () => any }>();

  const { vertical, textPosition, color, margin } = toRefs(props);

  const hasText = computed(() => !!slots.default);
  const dividerClasses = computed(() => {
    return {
      'acv-divider': true,
      [`acv-divider--color-${color.value}`]: color.value,
      'acv-divider--vertical': vertical.value,
      'acv-divider--horizontal': !vertical.value,
      'acv-divider--with-text': !vertical.value && hasText.value,
      [`acv-divider--with-text-${textPosition.value}`]:
        textPosition.value && !vertical.value && hasText.value && textPosition.value !== 'center'
    };
  });
  const height = computed(() => isNumber(vertical.value) ? `${vertical.value}px` : undefined);
  const textMargin = computed(() => isNumber(margin.value) ? `${margin.value}px` : margin.value);

  const dividerStyles = computed(() => {
    return {
      height: height.value,
      ...(textMargin.value && vertical.value
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
    aria-hidden="true"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
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
    --acv-divider-border: var(--acv-border-regular) solid var(--acv-divider-color);
    display: flex;
    padding: 0;
    border-top: var(--acv-divider-border);

    &.acv-divider--color-primary {
      --acv-divider-color: var(--acv-color-primary);
    }

    &.acv-divider--color-secondary {
      --acv-divider-color: var(--acv-color-secondary);
    }

    &.acv-divider--color-tertiary {
      --acv-divider-color: var(--acv-color-tertiary);
    }

    &.acv-divider--color-inverted {
      --acv-divider-color: var(--acv-color-inverted);
    }

    &.acv-divider--color-neutral {
      --acv-divider-color: var(--acv-color-neutral);
    }

    &.acv-divider--color-info {
      --acv-divider-color: var(--acv-color-info);
    }

    &.acv-divider--color-success {
      --acv-divider-color: var(--acv-color-success);
    }

    &.acv-divider--color-warning {
      --acv-divider-color: var(--acv-color-warning);
    }

    &.acv-divider--color-critical {
      --acv-divider-color: var(--acv-color-critical);
    }

    &.acv-divider--color-danger {
      --acv-divider-color: var(--acv-color-danger);
    }

    &.acv-divider--horizontal {
      width: 100%;
      margin: var(--acv-divider-v-margin) 0;
      clear: both;
    }

    &.acv-divider--vertical {
      position: relative;
      display: inline-block;
      height: 100%;
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
