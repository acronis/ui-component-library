<script lang="ts" setup></script>

<template>
  <div class="go-form-static">
    <slot />
  </div>
</template>

<style scoped>
  .go-form-static {
    /* @mixin text-ui-13; */
    min-block-size: var(--control-height);
  }
</style>
