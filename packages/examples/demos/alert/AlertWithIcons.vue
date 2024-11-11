<script setup>
  import AcvAlert from '@/components/alert/alert.vue';

  function onClose() {}
</script>

<template>
  <div class="qa-alert-basic">
    <AcvAlert
      type="info"
      icon="clr-pending--16"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="success"
      icon="clr-upsAcvl--16"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="warning"
      icon="clr-dot-warning--16"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="critical"
      icon="clr-dot-critical--16"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="error"
      icon="clr-stop--16"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <AcvAlert
      type="unknown"
      icon="clr-pause--16"
      description="This is a description."
      show-icon
      @close="onClose"
    />
  </div>
</template>
