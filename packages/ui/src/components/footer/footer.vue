<script lang="ts" setup>
  import AcvDivider from '../divider/divider.vue';

  defineOptions({ name: 'AcvFooter' });
</script>

<template>
  <div class="acv-footer">
    <AcvDivider />
    <div class="acv-footer_content">
      <slot name="side" />
      <div class="actions">
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

.acv-footer_content {
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
