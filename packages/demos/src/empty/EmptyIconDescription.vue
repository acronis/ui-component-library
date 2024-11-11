<script>
  import AcvEmpty from '@/components/empty/empty.vue';

  export default {
    components: { AcvEmpty },
    data() {
      return {
        icon: 'acronis-cloud-ill--72',
        description:
          'The discovery agent will obtain the neighbour IP addresses by using NetBIOS discovery, Web Service Discovery (WSD), and Address Resolution Protocol (ARP) table',
      };
    },
  };
</script>

<template>
  <div class="qa-empty-screen-icon-description">
    <AcvEmpty
      :icon="icon"
      :description="description"
    />
  </div>
</template>
