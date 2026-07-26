<script setup>
  import AcvSwitch from '@/components/switch/switch.vue';
  import { ref } from 'vue';

  const enabledNotifications = ref([]);
</script>

<template>
  <div class="grid-row place-items-stretch">
    <AcvSwitch
      v-model="enabledNotifications"
      value="accountActivity"
      label="accountActivity"
    />
    <AcvSwitch
      v-model="enabledNotifications"
      value="comment"
      label="comment"
    />
    <AcvSwitch
      v-model="enabledNotifications"
      value="like"
      label="like"
    />
    <AcvSwitch
      v-model="enabledNotifications"
      value="mention"
      label="mention"
    />
    <AcvSwitch
      v-model="enabledNotifications"
      value="follow"
      label="follow"
    />

    <p>Enabled Notifications: {{ enabledNotifications }}</p>
  </div>
</template>
