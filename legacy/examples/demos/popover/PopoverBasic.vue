<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
</script>

<template>
  <AcvPopover
    placement="right"
  >
    <template #reference>
      <AcvButton>Click me</AcvButton>
    </template>
    <div class="test-popover">
      Floating content
    </div>
  </AcvPopover>
</template>

<style scoped>
.test-popover {
  /* background-color: hsl(292deg, 100%, 50%); */
  padding: 8px;
  color: var(--acv-color-black);
}
</style>
