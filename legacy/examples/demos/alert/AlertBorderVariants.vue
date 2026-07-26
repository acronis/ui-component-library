<script setup>
  import AcvAlert from '@/components/alert/alert.vue';

  function onClose() {}
</script>

<template>
  <AcvAlert
    type="info"
    description="No border."
    show-icon
    @close="onClose"
  />
  <AcvAlert
    type="info"
    description="All borders."
    show-icon
    border
    @close="onClose"
  />
  <AcvAlert
    type="info"
    description="Top and bottom borders."
    show-icon
    :border="{ top: true, bottom: true }"
    @close="onClose"
  />
  <AcvAlert
    type="info"
    description="Only top border."
    show-icon
    :border="{ top: true }"
    @close="onClose"
  />
  <AcvAlert
    type="info"
    description="Only bottom border."
    show-icon
    :border="{ bottom: true }"
    @close="onClose"
  />
</template>
