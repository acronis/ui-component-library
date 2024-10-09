<script setup>
  import AcButton from '@/components/button/button.vue';
  import Popover from '@/components/popover/popover.vue';
  import { onMounted, ref } from 'vue';

  const testPopover = ref(null);
  const renderVisiblePopover = ref(false);

  onMounted(() => {
    setTimeout(() => {
      renderVisiblePopover.value = true;
    }, 600);
  });

  function onDetailsClick() {
    window.open('https://www.acronis.com', '_blank');
  }
</script>

<template>
  <template v-if="renderVisiblePopover">
    <Popover
      :reference-el="testPopover"
      :model-value="renderVisiblePopover"
      placement="right-start"
      width="300"
    >
      <div class="mx-24 my-16 acv-text acv-text--body-24">
        The system is preparing your report.
        Your report will be sent to you as soon
        as it is ready<br>
        <AcButton
          type="ghost"
          tabindex="0"
          class="mt-8 move-left"
          @keydown.enter="onDetailsClick"
          @click="onDetailsClick"
        >
          Details
        </AcButton>
      </div>
    </Popover>
  </template>
  <AcButton
    ref="testPopover"
    :class="{ 'is-selected': renderVisiblePopover }"
    @click="renderVisiblePopover = !renderVisiblePopover"
  >
    Button
  </AcButton>
</template>
