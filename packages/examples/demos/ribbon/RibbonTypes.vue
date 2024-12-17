<script setup>
  import AcvRibbon from '@/components/ribbon/ribbon.vue';
  import { reactive } from 'vue';

  const ribbons = reactive([
    {
      description: 'Informational message.',
      type: 'info'
    },
    {
      description: 'Success message.',
      type: 'success'
    },
    {
      description: 'Warning message.',
      type: 'warning'
    },
    {
      description: 'Critical message.',
      type: 'critical'
    },
    {
      description: 'Danger message.',
      type: 'danger'
    },
    {
      description: 'Neutral message.',
      type: 'neutral'
    }
  ]);

  function onClose(index) {
    ribbons.splice(index, 1);
  }
</script>

<template>
  <AcvRibbon
    :alerts="ribbons"
    @close="onClose"
  />
</template>
