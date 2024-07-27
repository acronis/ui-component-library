<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
</script>

<template>
  <AcvPopover trigger="click">
    <template #reference>
      <AcvButton>Click me</AcvButton>
    </template>
    <div class="ma-8">
      Content
    </div>
  </AcvPopover>

  <AcvPopover trigger="hover">
    <template #reference>
      <AcvButton>Hover me</AcvButton>
    </template>
    <div class="ma-8">
      Content
    </div>
  </AcvPopover>
</template>
