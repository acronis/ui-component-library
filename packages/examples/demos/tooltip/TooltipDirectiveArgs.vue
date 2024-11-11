<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { vTooltip } from '@/directives/tooltip.ts';
</script>

<template>
  <div class="example">
    <AcvButton
      v-tooltip:top="{ content: 'This is a tooltip' }"
    >
      Top
    </AcvButton>
    <AcvButton
      v-tooltip:right="{ content: 'This is a tooltip' }"
    >
      Right
    </AcvButton>
    <AcvButton
      v-tooltip:left="{ content: 'This is a tooltip' }"
    >
      Left
    </AcvButton>
    <AcvButton
      v-tooltip:bottom="{ content: 'This is a tooltip' }"
    >
      Bottom
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
