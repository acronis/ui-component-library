<script>
  import AcvEmpty from '@/components/empty/empty.vue';

  export default {
    components: { AcvEmpty },
    data() {
      return {
        icon: 'acronis-cloud-ill--72',
        title: 'Discovery agent',
        description:
          'The discovery agent will obtain the neighbour IP addresses by using NetBIOS discovery, Web Service Discovery (WSD), and Address Resolution Protocol (ARP) table',
      };
    },
  };
</script>

<template>
  <div class="qa-empty-screen-basic">
    <AcvEmpty
      :icon="icon"
      :title="title"
      :description="description"
    />
  </div>
</template>
