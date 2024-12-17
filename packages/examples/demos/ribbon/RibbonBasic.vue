<script setup>
  import AcvRibbon from '@/components/ribbon/ribbon.vue';
  import { reactive } from 'vue';

  const alerts = reactive([
    {
      description: `Data center maintenance is scheduled for ${new Date()}. For more details, refer to the`,
      type: 'info',
      link: {
        href: 'https://www.acronis.com/en-sg/',
        target: '_blank',
        title: 'Status Page'
      }
    },
    {
      description: `Data center`,
      type: 'critical',
      link: {
        href: 'https://www.acronis.com/en-sg/',
        target: '_blank',
        title: 'About Page'
      }
    }
  ]);

  function onClose(index) {
    alerts.splice(index, 1);
  }
</script>

<template>
  <AcvRibbon
    :alerts="alerts"
    @close="onClose"
  />
</template>
