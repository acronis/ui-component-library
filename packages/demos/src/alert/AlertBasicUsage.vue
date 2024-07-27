<script setup>
  import AcvAlert from '@/components/alert/alert.vue';

  function onClose() {
    console.log('Alert is closed');
  }
</script>

<template>
  <div class="qa-alert-basic">
    <AcvAlert
      type="info"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="success"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="warning"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="critical"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="error"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="unknown"
      description="This is a description."
      show-icon
      @close="onClose"
    />
  </div>
</template>

<style scoped>
.acv-alert {
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }
}
</style>
