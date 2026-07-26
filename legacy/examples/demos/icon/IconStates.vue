<script setup>
  import ElCheckbox from '@/components/checkbox/checkbox.vue';
  import ElIcon from '@/components/icon/icon.vue';
</script>

<script>
  export default {
    data: () => ({
      iconState1: true,
      iconState2: true,
      iconState3: true,
      iconState4: true,
    }),
  };
</script>

<template>
  <preview-group class="qa-status-icons">
    <preview
      name="Notification state"
      span="12"
    >
      <div>
        <ElIcon
          v-if="!iconState1"
          name="IconRecoveryServer24"
          color="brand-primary"
          size="large"
        />
        <ElIcon
          v-else
          name="IconRecoveryServerState24"
          state="IconSuccessMix32"
          color="brand-primary"
          size="large"
        />
      </div>
      <div class="my-8" />
      <ElCheckbox v-model="iconState1">
        Toggle
      </ElCheckbox>
    </preview>
    <preview
      name="Downloading state"
      span="12"
    >
      <div>
        <ElIcon
          v-if="!iconState2"
          name="IconRecoveryServer24"
          color="brand-primary"
          size="large"
        />
        <ElIcon
          v-else
          name="IconRecoveryServerState24"
          state="IconDownloadMix32"
          color="brand-primary"
          size="large"
        />
      </div>
      <div class="my-8" />
      <ElCheckbox v-model="iconState2">
        Toggle
      </ElCheckbox>
    </preview>
    <preview
      name="Uploading state"
      span="12"
    >
      <div>
        <ElIcon
          v-if="!iconState3"
          name="IconRaid24"
          color="brand-primary"
          size="large"
        />
        <ElIcon
          v-else
          name="IconRaidStatus24"
          state="IconPauseMix32"
          color="brand-primary"
          state-color="status-danger-secondary"
          size="large"
        />
      </div>
      <div class="my-8" />
      <ElCheckbox v-model="iconState3">
        Toggle
      </ElCheckbox>
    </preview>
    <preview
      name="Paused state"
      span="12"
    >
      <div>
        <ElIcon
          v-if="!iconState4"
          name="IconFolder32"
          color="brand-primary"
          size="large"
        />
        <ElIcon
          v-else
          name="IconFolderMix32"
          state="IconDangerMix32"
          color="brand-primary"
          size="large"
        />
      </div>
      <div class="my-8" />
      <ElCheckbox v-model="iconState4">
        Toggle
      </ElCheckbox>
    </preview>
  </preview-group>
</template>
