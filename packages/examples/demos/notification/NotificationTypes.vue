<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { useNotify } from '@/components/notification/useNotify';

  const $notify = useNotify();

  function onSuccessClick() {
    $notify.success({
      title: 'Success',
      message: 'This is a success message',
    });
  }

  function onWarningClick() {
    $notify.warning({
      title: 'Warning',
      message: 'This is a warning message',
    });
  }

  function onCriticalClick() {
    $notify.warning({
      title: 'Critical',
      message: 'This is a critical message',
    });
  }

  function onErrorClick() {
    $notify.error({
      title: 'Error',
      message: 'This is an error message',
    });
  }

  function onInfoClick() {
    $notify.info({
      title: 'Info',
      message: 'This is a info message',
    });
  }

  function onProgressClick() {
    $notify.progress({
      title: 'In-progress',
      message: 'This is an in-progress message',
    });
  }
</script>

<script>
  export default {
    methods: {
    },
  };
</script>

<template>
  <div>
    <AcvButton @click="onInfoClick">
      Info
    </AcvButton>
    <AcvButton @click="onSuccessClick">
      Success
    </AcvButton>
    <AcvButton @click="onWarningClick">
      Warning
    </AcvButton>
    <AcvButton @click="onCriticalClick">
      Critical
    </AcvButton>
    <AcvButton @click="onErrorClick">
      Error
    </AcvButton>
    <AcvButton @click="onProgressClick">
      In-progress
    </AcvButton>
  </div>
</template>
