<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvCard from '@/components/card/card.vue';
  import AcvInput from '@/components/input/input.vue';
  import { AcvNotificationPosition, AcvNotificationType, useNotify } from '@/components/notification/public';
  import { ref } from 'vue';

  const $notify = useNotify();
  const message = ref('This is a sample message');
  const type = ref(AcvNotificationType.SUCCESS);
  const position = ref(AcvNotificationPosition.TOP_RIGHT);
  const dismissOnClick = ref(false);
  const queue = ref(false);

  function showNotification() {
    $notify.open({
      queue: queue.value,
      dismissOnClick: dismissOnClick.value,
      type: type.value,
      position: position.value,
      message: message.value,
      showClose: false,
    });
  }

  function showAll() {
    Object.values(AcvNotificationType).forEach((type) => {
      $notify.open({
        queue: queue.value,
        dismissOnClick: dismissOnClick.value,
        type,
        position: position.value,
        message: message.value,
        showClose: false,
      });
    });
  }

  function dismissAll() {
    $notify.clear();
  }
</script>

<template>
  <AcvCard>
    <AcvInput v-model="message" />
    <br>
    <AcvButton @click="showNotification">
      Show notification
    </AcvButton>
    <AcvButton @click="showAll">
      Show all
    </AcvButton>
    <AcvButton @click="dismissAll">
      Dismiss all
    </AcvButton>
  </AcvCard>
</template>
