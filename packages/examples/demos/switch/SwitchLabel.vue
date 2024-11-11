<script setup>
  import AcvSwitch from '@/components/switch/switch.vue';
  import { ref } from 'vue';

  const emailNotifications = ref(false);
  const pushNotifications = ref(false);
  const mobileNotifications = ref(false);
</script>

<template>
  <div class="grid-row place-items-stretch">
    <AcvSwitch
      v-model="emailNotifications"
      label="Email notifications"
    />
    <AcvSwitch
      v-model="pushNotifications"
      label="Push notifications"
    />
    <AcvSwitch
      v-model="mobileNotifications"
      label="Mobile notifications"
    />
  </div>
</template>
