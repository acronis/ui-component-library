<script setup>
  import AcvAlert from '@/components/alert/alert.vue';
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <div class="qa-alert-custom-content">
    <AcvAlert
      type="info"
      hide-close
    >
      <template #title>
        System message
      </template>
      <template #description>
        The system is preparing your report.Your report will be sent to you as soon as it is ready
      </template>
      <template #actions>
        <AcvButton type="ghost">
          Details
        </AcvButton>
        <AcvButton type="ghost">
          Download log
        </AcvButton>
      </template>
    </AcvAlert>
    <AcvAlert
      type="info"
      hide-close
      show-icon
    >
      <slot>
        <div style="margin-bottom:20px;">
          The system is preparing your report.
        </div>
        <div style="margin-bottom:20px;">
          Your report will be sent to you as soon as it is ready.
        </div>
        <div>Thank you</div>
      </slot>
    </AcvAlert>
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
