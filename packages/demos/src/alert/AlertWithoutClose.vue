<script setup>
  import { AcvAlert } from '@acronis-platform/ui-component-library';
</script>

<template>
  <div class="qa-alert-without-close">
    <AcvAlert
      type="info"
      description="This is a description."
      hide-close
    />
  </div>
</template>
