<script lang="ts" setup>
  // import { injectGoForm } from '@/composables';
  import type { AcvButtonProps } from '@/components';
  // import AcvButton from '@/components/button/button.vue';

  defineProps<AcvButtonProps>();
  // const { loadState } = injectGoForm();
</script>

<template>
  <!--  TODO: we should use type submit, to submit form -->
  <!--  <AcvButton -->
  <!--    v-bind="$props" -->
  <!--    type="submit" -->
  <!--    :loading="loadState === 'loading' || loading" -->
  <!--  > -->
  <!--    <template v-if="$slots.icon" #icon> -->
  <!--      <slot name="icon"></slot> -->
  <!--    </template> -->
  <slot />
<!--  </AcvButton> -->
</template>

<style scoped></style>
