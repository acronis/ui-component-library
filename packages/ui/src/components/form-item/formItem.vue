<script setup lang="ts">
  import { computed } from 'vue';
  import AcvTypography from '../typography/typography.vue';
  import AcvFormLabel from '../form-label/formLabel.vue';
  import type {
    AcvFormItemEvents,
    AcvFormItemProps,
    AcvFormItemSlots
  } from './formItem.ts';
  import './formItem.css';

  defineOptions({
    name: 'AcvFormItem',
    inheritAttrs: false,
  });
  const { title, control, titlePlacement } = defineProps<AcvFormItemProps>();

  defineEmits<AcvFormItemEvents>();
  defineSlots<AcvFormItemSlots>();

  const formItemClasses = computed(() => ({
    'acv-form-item': true,
    [titlePlacement as string]: titlePlacement,
  }));

  const validationClasses = computed(() => ({
    'acv-validation-message': true,
    'acv-validation-message--error': true,
  }));
</script>

<template>
  <div
    :class="formItemClasses"
  >
    <AcvFormLabel>
      <template #label>
        <AcvTypography
          class="title"
          variant="body-large"
          component="span"
          :disabled="$attrs.disabled"
        >
          <slot>
            {{ title }}
          </slot>
        </AcvTypography>
      </template>
      <control
        v-bind="$attrs"
      />
    </AcvFormLabel>

    <p
      v-if="$slots.validationMessage"
      :class="validationClasses"
    >
      <slot name="validationMessage" />
    </p>
    <p
      v-if="$slots.helper"
      class="helper"
    >
      <slot name="helper" />
    </p>
  </div>
</template>

<style scoped>
  .acv-form-item {
    display: inline-flex;
    user-select: none;
    flex-wrap: nowrap;
    align-items: normal;
    cursor: pointer;
    gap: 8px;
    font-family: var(--acv-font-family-default), sans-serif;

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

    .helper {
      margin-top: 16px;
      font-size: var(--acv-font-size-note);
      color: var(--acv-color-primary);
    }

    @media (prefers-color-scheme: dark) {
      .helper {
        color: var(--acv-color-primary-dark);
      }
    }
  }
</style>
