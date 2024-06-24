<script setup>
  import Ribbon from '@/components/ribbon/ribbon.vue';

  const alerts = [
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
      description: `Data center maintenance is scheduled for ${new Date()}. For more details, refer to the`,
      type: 'critical',
      link: {
        href: 'https://www.acronis.com/en-sg/',
        target: '_blank',
        title: 'About Page'
      }
    }
  ];
</script>

<template>
  <Ribbon :alerts="alerts" />
</template>
