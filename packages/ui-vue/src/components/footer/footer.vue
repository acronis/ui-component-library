<script lang="ts" setup>
  import type { AcvFooterSlots } from './footer.ts';
  import AcvDivider from '../divider/divider.vue';

  defineOptions({ name: 'AcvFooter' });
  defineSlots<AcvFooterSlots>();
</script>

<template>
  <div class="acv-footer">
    <AcvDivider />
    <div class="acv-footer-content">
      <slot name="side" />
      <div class="actions">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.acv-footer {
  --acv-divider-v-margin: 0;
  display: flex;
  flex-direction: column;
}

.acv-footer-content {
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
