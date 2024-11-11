<script setup>
  import Checkbox from '@/components/checkbox/checkbox.vue';
  import Icon from '@/components/icon/icon.vue';
  import { ref } from 'vue';

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
          name="Hdd32"
          size="64"
          color="primary"
        />
        <Icon
          v-else
          name="HddMix32"
          state="ForbiddenMix32"
          size="64"
          color="primary"
          state-color="success"
        />
      </div>
      <div class="my-8" />
      <Checkbox v-model="iconState1">
        Toggle
      </Checkbox>
    </Preview>
    <Preview
      name="Downloading state"
      span="6"
    >
      <div>
        <Icon
          v-if="!iconState2"
          name="Folder32"
          size="64"
          color="primary"
        />
        <Icon
          v-else
          name="FolderMix32"
          state="DownloadMix32"
          size="64"
          color="primary"
          state-color="success"
        />
      </div>
      <div class="my-8" />
      <Checkbox v-model="iconState2">
        Toggle
      </Checkbox>
    </Preview>
    <Preview
      name="Play state"
      span="6"
    >
      <div>
        <Icon
          v-if="!iconState3"
          name="Folder32"
          size="64"
          color="primary"
        />
        <Icon
          v-else
          name="FolderMix32"
          state="PlayMix32"
          size="64"
          color="primary"
        />
      </div>
      <div class="my-8" />
      <Checkbox v-model="iconState3">
        Toggle
      </Checkbox>
    </Preview>
    <Preview
      name="Paused state"
      span="6"
    >
      <div>
        <Icon
          v-if="!iconState4"
          name="Folder32"
          size="64"
          color="brand-primary"
        />
        <Icon
          v-else
          name="FolderMix32"
          state="PauseMix32"
          size="64"
          color="brand-primary"
        />
      </div>
      <div class="my-8" />
      <Checkbox v-model="iconState4">
        Toggle
      </Checkbox>
    </Preview>
  </PreviewGroup>
</template>
