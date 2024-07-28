<script setup lang="ts">
  import type { AcvAlertEvents, AcvAlertProps, AcvAlertSlots } from './alert.ts';

  import './alert.css';

  defineOptions({
    name: 'Alert',
  });

  const {
    color,
    title,
    description,
    showClose,
    showIcon
  } = withDefaults(defineProps<AcvAlertProps>(), {
    showClose: false,
    color: 'info',
  });

  defineEmits<AcvAlertEvents>();
  const slots = defineSlots<AcvAlertSlots>();
</script>

<template>
  <div
    class="acv-alert"
    :class="color"
    role="alert"
  >
    <div class="content">
      <div
        v-if="showIcon || $slots.icon"
        class="icon"
      >
        <slot name="icon">
          <span v-if="color === 'info'">I</span>
          <span v-else-if="color === 'warning'">I</span>
          <span v-else-if="color === 'error'">I</span>
          <span v-else-if="color === 'critical'">I</span>
          <span v-else-if="color === 'unknown'">I</span>
          <span v-else-if="color === 'success'">I</span>
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
      @click="$emit('close')"
    >
      X
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
    line-height: var(--acv-font-line-height-medium);

    .content {
      display: grid;
      grid-template-columns: min-content 1fr;
      grid-auto-columns: auto;
      grid-template-rows: auto auto auto;
      padding: 8px 0 8px 24px;
    }

    &.info {
      background-color: var(--acv-color-status-info-primary);
    }

    &.success {
      background-color: var(--acv-color-status-success-primary);
    }

    &.warning {
      background-color: var(--acv-color-status-warning-primary);
    }

    &.critical {
      background-color: var(--acv-color-status-critical-primary);
    }

    &.error {
      background-color: var(--acv-color-status-danger-primary);
    }

    &.unknown {
      background-color: var(--acv-color-status-neutral-primary);
    }
  }

  .icon {
    display: flex;
  }

  .title {
    color: var(--acv-alert-title-color);
    grid-column: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* TODO use mixin */
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
    margin-top: 8px;
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
    border-left: var(--acv-border-regular) var(--acv-color-status-info-primary);
  }

  .right ~ .close {
    grid-column: 4;
  }
</style>
