<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { useNotify } from '@/components/notification/useNotify';

  const $notify = useNotify();

  function onTopRightClick() {
    $notify.open({
      title: 'Custom Position',
      message: 'I\'m at the top right corner',
    });
  }

  function onBottomRightClick() {
    $notify.open({
      title: 'Custom Position',
      message: 'I\'m at the bottom right corner',
      position: 'bottom-right',
    });
  }

  function onBottomLeftClick() {
    $notify.open({
      title: 'Custom Position',
      message: 'I\'m at the bottom left corner',
      position: 'bottom-left',
    });
  }

  function onTopLeftClick() {
    $notify.open({
      title: 'Custom Position',
      message: 'I\'m at the top left corner',
      position: 'top-left',
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
    <AcvButton @click="onTopRightClick">
      Top Right
    </AcvButton>
    <AcvButton @click="onBottomRightClick">
      Bottom Right
    </AcvButton>
    <AcvButton @click="onBottomLeftClick">
      Bottom Left
    </AcvButton>
    <AcvButton @click="onTopLeftClick">
      Top Left
    </AcvButton>
  </div>
</template>
