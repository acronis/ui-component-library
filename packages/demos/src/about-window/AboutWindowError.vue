<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { ref } from 'vue';
  // import AcvAboutWindow from '@/components/about-window/about-window.vue';

  const visible = ref(false);

  function showAboutWindow() {
    visible.value = true;
  }
</script>

<template>
  <div>
    <AcvButton
      type="primary"
      @click="showAboutWindow"
    >
      Show About Window
    </AcvButton>
    <AcvAboutWindow
      v-model:visible="visible"
      title="About Window"
      width="400"
      height="300"
      type="error"
      @close="visible = false"
    >
      <template #versions>
        <span>Web console service: 12.0.1953</span>
        <span>Backup management service: 12.0.2353</span>
      </template>
      <template #actions>
        <AcvButton type="secondary">
          What's New
        </AcvButton>
        <AcvButton>Update</AcvButton>
      </template>
      <template #links>
        <a>User's Guide</a>
      </template>
    </AcvAboutWindow>
  </div>
</template>
