<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { vTooltip } from '@/directives/tooltip.ts';
</script>

<template>
  <div class="example">
    <AcvButton
      v-tooltip:top.click.persist="{ content: 'This is a tooltip' }"
    >
      Click me
    </AcvButton>
  </div>
</template>

<style scoped>
.example {
  display: flex;
  gap: 10px;
  margin-block: 200px;
  margin-inline: 200px;
}
</style>
