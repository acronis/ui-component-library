<script lang="ts" setup>
  import AcvDivider from '../divider/divider.vue';

  defineOptions({ name: 'AcvFooter' });
</script>

<template>
  <div class="acv-footer">
    <AcvDivider />
    <div class="content">
      <!-- @slot Used to pass a custom side content (text or link by design) -->
      <slot name="side" />
      <div class="actions">
        <!-- @slot The default slot content (for buttons by design) -->
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.acv-footer {
  --_acv-divider-v-margin: 0;
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  align-items: center;
  gap: var(--acv-spacing-regular);
  padding-block: var(--acv-spacing-regular);
  padding-inline: var(--acv-spacing-large);
}

.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--acv-spacing-regular);
}
</style>
