<script setup>
  import { ref } from 'vue';
  import Checkbox from '@/components/checkbox/checkbox.vue';
  import Icon from '@/components/icon/icon.vue';

  const iconState1 = ref(true);
  const iconState2 = ref(true);
  const iconState3 = ref(true);
  const iconState4 = ref(true);
</script>

<template>
  <PreviewGroup class="qa-status-icons">
    <Preview
      name="Notification state"
      span="6"
    >
      <div>
        <Icon
          v-if="!iconState1"
          name="NotificationsDOSmall"
          color="brand-primary"
          stateColor="success"
        >
        </Icon>
        <Icon
          v-else
          name="NotificationsWithStateDOSmall"
          state="StateAlertDSmall"
          color="brand-primary"
          stateColor="success"
        >
        </Icon>
      </div>
      <div class="my-8"></div>
      <Checkbox v-model="iconState1">
        Toogle
      </Checkbox>
    </Preview>
    <Preview
      name="Downloading state"
      span="6"
    >
      <div>
        <Icon
          v-if="!iconState2"
          name="i-folder-d-o--16"
          color="primary"
        >
        </Icon>
        <Icon
          v-else
          name="i-folder-with-state-d-o--16"
          state="i-state-download-d--16"
          color="primary"
          stateColor="success"
        >
        </Icon>
      </div>
      <div class="my-8"></div>
      <Checkbox v-model="iconState2">
        Toogle
      </Checkbox>
    </Preview>
    <Preview
      name="Uploading state"
      span="6"
    >
      <div>
        <Icon
          v-if="!iconState3"
          name="i-folder-d-o--16"
          color="primary"
        >
        </Icon>
        <Icon
          v-else
          name="i-folder-with-state-d-o--16"
          state="i-state-upload-d--16"
          color="primary"
        >
        </Icon>
      </div>
      <div class="my-8"></div>
      <Checkbox v-model="iconState3">
        Toogle
      </Checkbox>
    </Preview>
    <Preview
      name="Paused state"
      span="6"
    >
      <div>
        <Icon
          v-if="!iconState4"
          name="i-folder-d-o--16"
          color="brand-primary"
        >
        </Icon>
        <Icon
          v-else
          name="i-folder-with-state-d-o--16"
          state="i-state-pause-d--16"
          color="brand-primary"
        >
        </Icon>
      </div>
      <div class="my-8"></div>
      <Checkbox v-model="iconState4">
        Toogle
      </Checkbox>
    </Preview>
  </PreviewGroup>
</template>
