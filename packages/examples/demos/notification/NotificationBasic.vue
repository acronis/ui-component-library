<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { useNotify } from '@/components/notification/useNotify.ts';

  const $notify = useNotify();

  function onCloseAutomaticallyClick() {
    $notify.open({
      message: 'This is a message that automatically close',
      showClose: false,
    });
  }

  function onCloseManuallyClick() {
    $notify.open({
      message: 'This is a message that does not automatically close',
      duration: 0,
    });
  }
</script>

<template>
  <div>
    <AcvButton @click="onCloseAutomaticallyClick">
      Closes automatically
    </AcvButton>
    <AcvButton @click="onCloseManuallyClick">
      Won't close automatically
    </AcvButton>
  </div>
</template>
