<script>
  import ElEmpty from '@/widgets/empty/empty.vue';

  export default {
    components: { ElEmpty },
    data() {
      return {
        icon: 'acronis-cloud-ill--72',
        title: 'Discovery agent',
        description:
          'The discovery agent will obtain the neighbour IP addresses by using NetBIOS discovery, Web Service Discovery (WSD), and Address Resolution Protocol (ARP) table',
        buttonText: 'Configure',
      };
    },
  };
</script>

<template>
  <div class="qa-empty-screen-basic">
    <ElEmpty
      :icon="icon"
      :title="title"
      :description="description"
      :button-text="buttonText"
    />
  </div>
</template>
