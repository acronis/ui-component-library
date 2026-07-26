<script lang="ts" setup>
  // import GoStatusTag from '../GoStatusTag/GoStatusTag.vue';

  import GoFormRow from '@/components/GoForm/GoFormRow.vue';

  withDefaults(
    defineProps<{
      labelFor?: string
      label?: string
      hint?: string
      errorMessage?: string
      error?: boolean
      optional?: boolean
    }>(),
    {
      error: true,
    },
  );
</script>

<template>
  <GoFormRow>
    <label
      v-if="label"
      class="label"
      :for="labelFor"
    >
      <span>{{ label }}</span>
      <span
        v-if="optional"
        class="optional"
      >(Optional)</span>
      <span
        v-if="$slots.informer"
        class="informer"
      >
        <slot name="informer" />
      </span>
    </label>
    <div class="content-wrap">
      <div class="content">
        <slot />
      </div>
      <div
        v-if="$slots.addition"
        class="addition"
      >
        <slot name="addition" />
      </div>
    </div>
    <div
      v-if="hint && (!error || !errorMessage)"
      class="hint"
    >
      {{ hint || '&nbsp;' }}
    </div>
    <div
      v-else-if="error"
      class="error-message"
      :class="{ 'error-message_show': !!errorMessage }"
    >
      <!--      <GoStatusTag size="xxs" variant="error"> -->
      {{ errorMessage }}
      <!--      </GoStatusTag> -->
    </div>
  </GoFormRow>
</template>

<style scoped>
  .content-wrap {
    display: flex;
  }

  .addition {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline-start: 4px;
  }

  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .label {
    display: inline-flex;
    align-items: center;
    margin-block-end: 4px;
  }

  .informer {
    display: inline-flex;
    margin-inline-start: 8px;
  }

  .optional {
    color: var(--color-glyph-tretiary);
    margin-inline-start: 2px;
  }

  .hint {
  /*  @mixin text-ui-11; */
    color: var(--color-glyph-secondary);
    margin-block-start: 4px;
  }

  .error-message {
    margin-block-start: 4px;
    min-block-size: var(--line-height-text-ui-11);
    visibility: hidden;
    word-break: break-word;
  }

  .error-message_show {
    visibility: visible;
  }
</style>
