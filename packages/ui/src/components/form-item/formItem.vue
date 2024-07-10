<script setup lang="ts">
  import { computed, defineProps, defineSlots } from 'vue';
  import type {
    AcvFormItemEvents,
    AcvFormItemProps,
    AcvFormItemSlots
  } from './formItem.ts';
  import AcvTypography from '@/components/typography/typography.vue';
  import './formItem.css';

  const { title, control, titlePlacement } = defineProps<AcvFormItemProps>();

  defineEmits<AcvFormItemEvents>();
  defineSlots<AcvFormItemSlots>();

  const formItemClasses = computed(() => ({
    'acv-form-item': true,
    [titlePlacement]: titlePlacement,
  }));
</script>

<template>
  <label :class="formItemClasses">
    <control v-bind="$attrs" />
    <AcvTypography
      variant="body.large"
      component="span"
      :disabled="$attrs.disabled"
    >
      <slot>
        {{ title }}
      </slot>
    </AcvTypography>
  </label>
</template>

<style scoped>
  .acv-form-item {
    display: inline-flex;
    user-select: none;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;

    &.top {
      flex-direction: column-reverse;
    }

    &.bottom {
      flex-direction: column;
    }

    &.left {
      flex-direction: row-reverse;
    }

    &.right {
      flex-direction: row;
    }

    &:has(:required):after {
      content: '*';
      color: var(--acv-color-danger);
      margin-left: 4px;
    }
  }
</style>
