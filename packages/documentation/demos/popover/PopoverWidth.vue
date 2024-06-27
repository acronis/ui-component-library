<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
</script>

<template>
  <AcvPopover :width="256">
    <template #reference>
      <AcvButton>Click me</AcvButton>
    </template>
    <div>Content</div>
  </AcvPopover>
</template>
