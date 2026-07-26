<script lang="ts" setup>
  import type { AcvButtonProps } from '@/components';
  import GoFormFooter from '@/components/GoForm/GoFormFooter.vue';
  import GoFormSubmitButton from '@/components/GoForm/GoFormSubmitButton.vue';
  import { omit } from '@acronis-platform/utils';
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<
      AcvButtonProps & {
        right?: boolean
        border?: boolean
        submitText?: string
        submitButton?: boolean
      }
    >(),
    {
      submitText: 'Save',
      size: 'large',
      submitButton: true,
    },
  );
  const buttonProps = computed(() =>
    omit(props, ['right', 'border', 'submitText', 'submitButton']),
  );
</script>

<template>
  <GoFormFooter
    :border="border"
    :right="right"
  >
    <GoFormSubmitButton
      v-if="submitButton"
      v-bind="buttonProps"
    >
      <template
        v-if="$slots.submitButtonIcon"
        #icon
      >
        <slot name="submitButtonIcon" />
      </template>
      {{ submitText }}
    </GoFormSubmitButton>
    <slot />
    <template
      v-if="$slots.side"
      #side
    >
      <slot name="side" />
    </template>
  </GoFormFooter>
</template>

<style scoped></style>
