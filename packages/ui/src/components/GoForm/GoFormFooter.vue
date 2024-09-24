<script lang="ts" setup>
  defineProps<{
    right?: boolean
    border?: boolean
  }>();
</script>

<template>
  <div
    class="go-form-footer"
    :class="[right && 'go-form-footer_right', border && 'go-form-footer_border']"
  >
    <slot />
    <div
      v-if="$slots.side"
      class="side"
    >
      <slot name="side" />
    </div>
  </div>
</template>

<style scoped>
  .go-form-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-block-start: var(--base-form-actions-margin);
  }

  .go-form-footer_right {
    flex-direction: row-reverse;
  }

  .go-form-footer_border {
    padding: 12px;
    border-block-start: var(--border-secondary);
  }

  .side {
    margin-inline-start: auto;
  }

  .go-form-footer_right .side {
    margin-inline: 0 auto;
  }
</style>
