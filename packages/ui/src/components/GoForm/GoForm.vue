<script lang="ts" setup>
  import type { PromiseFunction } from '@acronis-platform/utils';
  import type { GoFormValues } from '@/composables';
  import { injectGoFormSafe, provideGoForm } from '@/composables';

  const props = defineProps<{
    fixedWidth?: boolean
    initialValues?: GoFormValues
    formName?: string
    submit?: PromiseFunction
  }>();

  const { resetForm, submitForm, handleSubmit, resetGoForm, loadState, values, meta }
    = useGoForm();

  // eslint-disable-next-line ts/no-unused-expressions
  props.submit && handleSubmit(props.submit);

  function onReset() {
    resetForm();
    resetGoForm();
  }

  /**
   * Inject or provide veeForm and our extension
   * It can be used even in higher components relative to GoForm. In that case GoForm
   *   simply inject it
   */
  function useGoForm() {
    return (
      injectGoFormSafe<GoFormValues>()
      || provideGoForm<GoFormValues>({ initialValues: props.initialValues })
    );
  }
</script>

<template>
  <form
    :class="fixedWidth && 'go-form_fixed-width'"
    novalidate
    @submit="submitForm"
    @reset.prevent="onReset"
  >
    <slot
      :values="values"
      :is-loading="loadState === 'loading'"
      :submit-form="submitForm"
      :meta="meta"
    />
  </form>
</template>

<style scoped>
  .go-form_fixed-width {
    inline-size: var(--control-max-width);
  }
</style>
