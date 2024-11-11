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
      @close="visible = false"
    >
      <template #content>
        <p>Content</p>
      </template>
    </AcvAboutWindow>
  </div>
</template>
