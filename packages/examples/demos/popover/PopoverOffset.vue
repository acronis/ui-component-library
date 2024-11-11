<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
</script>

<template>
  <AcvPopover :offset="48">
    <template #reference>
      <AcvButton>Click me</AcvButton>
    </template>
    <div class="pa-16">
      Tests
    </div>
  </AcvPopover>
</template>
