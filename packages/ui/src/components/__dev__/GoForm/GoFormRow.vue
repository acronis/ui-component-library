<script lang="ts" setup>
  defineProps<{
    fixedWidth?: boolean
  }>();
</script>

<template>
  <div
    class="go-form-row"
    :class="fixedWidth && 'go-form-row_fixed-width'"
  >
    <slot />
  </div>
</template>

<style scoped>
  .go-form-row_fixed-width {
    inline-size: var(--control-max-width);
  }

  .go-form-row + .go-form-row {
    margin-block-start: var(--control-offset);
  }
</style>
