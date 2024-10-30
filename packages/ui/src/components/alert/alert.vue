<script setup lang="ts">
  import type { AcvAlertEvents, AcvAlertProps, AcvAlertSlots } from './alert.ts';
  import AcvButton from '@/components/button/button.vue';
  import { IconClose16 } from '@acronis-platform/icons/close';
  import { IconPlaceholder16 } from '@acronis-platform/icons/placeholder';
  import { computed } from 'vue';

  import './alert.css';

  /**
   * Alert displays a brief, important message without interrupting user's task.
   */
  defineOptions({
    name: 'AcvAlert',
  });

  const {
    color = 'info',
    title,
    description,
    showClose = false,
    showIcon,
    showBorder
  } = defineProps<AcvAlertProps>();

  defineEmits<AcvAlertEvents>();
  const slots = defineSlots<AcvAlertSlots>();

  const alertClasses = computed(() => {
    return {
      'acv-alert': true,
      [color]: true,
      'border': showBorder
    };
  });
</script>

<template>
  <div
    :class="alertClasses"
    role="alert"
  >
    <div class="content">
      <div
        v-if="showIcon || $slots.icon"
        class="icon"
      >
        <slot name="icon">
          <span v-if="color === 'info'"><IconPlaceholder16 /></span>
          <span v-else-if="color === 'success'"><IconPlaceholder16 /></span>
          <span v-else-if="color === 'warning'"><IconPlaceholder16 /></span>
          <span v-else-if="color === 'critical'"><IconPlaceholder16 /></span>
          <span v-else-if="color === 'danger'"><IconPlaceholder16 /></span>
          <span v-else-if="color === 'neutral'"><IconPlaceholder16 /></span>
        </slot>
      </div>
      <div
        v-if="title || $slots.title"
        class="title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div
        v-if="description || $slots.description"
        class="description"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>
      <div
        v-else-if="slots.default"
        class="description"
      >
        <slot />
      </div>
      <div
        v-if="slots.actions"
        class="actions"
      >
        <slot name="actions" />
      </div>
      <div
        v-if="slots.right"
        class="right"
      >
        <slot name="right" />
      </div>
    </div>
    <div
      v-if="showClose"
      class="close"
    >
      <AcvButton
        variant="ghost"
        @click="$emit('close')"
      >
        <IconClose16 />
      </AcvButton>
    </div>
  </div>
</template>

<style scoped>
  .acv-alert {
    display: grid;
    grid-auto-columns: auto 64px;
    border-radius: var(--acv-alert-border-radius);
    column-gap: 24px;
    color: var(--acv-color-text-primary);
    font-family: var(--acv-font-family-default), sans-serif;
    font-size: var(--acv-font-size-body);
    line-height: var(--acv-font-line-height-regular);
    width: 100%;
    border: 1px solid var(--acv-border-color);
    background: var(--acv-background-color);

    .content {
      display: grid;
      grid-template-columns: min-content 1fr;
      grid-auto-columns: auto;
      grid-template-rows: 24px auto  auto;
      padding: 8px 0 8px 24px;
    }

    &.info {
      --acv-background-color: var(--acv-background-color-info);
      --acv-border-color: var(--acv-border-color-info);
    }

    &.success {
      --acv-background-color: var(--acv-background-color-success);
      --acv-border-color: var(--acv-border-color-success);
    }

    &.warning {
      --acv-background-color: var(--acv-background-color-warning);
      --acv-border-color: var(--acv-border-color-warning);
    }

    &.critical {
      --acv-background-color: var(--acv-background-color-critical);
      --acv-border-color: var(--acv-border-color-critical);
    }

    &.danger {
      --acv-background-color: var(--acv-background-color-danger);
      --acv-border-color: var(--acv-border-color-danger);
    }

    &.neutral {
      --acv-background-color: var(--acv-background-color-neutral);
      --acv-border-color: var(--acv-border-color-neutral);
    }
  }

  .icon {
    display: flex;
    align-items: center;
    margin-inline-end: 16px;
  }

  .title {
    color: var(--acv-alert-title-color);
    grid-column: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: var(--acv-font-weight-strong);
  }

  .description {
    grid-column: 2;
    word-break: break-word;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 16px;
    grid-column: 2;
    margin-top: 12px;
  }

  .right {
    display: flex;
    align-items: center;
    grid-row: 1/-1;
    grid-column: 3;
  }

  .close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 100%;
    cursor: pointer;
    margin-left: auto;
    grid-column: 2;
    border-left: var(--acv-border-regular, 1px) solid var(--acv-color-divider-primary, hsl(215deg 60% 92%));  }

  .right ~ .close {
    grid-column: 4;
  }
</style>
