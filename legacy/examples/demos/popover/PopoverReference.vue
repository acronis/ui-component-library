<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
  import { ref } from 'vue';

  const popoverReference = ref(null);
  const popoverReferenceVisible = ref(false);

  function handleTogglePopoverVisible() {
    // popoverReference.value = document.getElementById('popoverReference');
    popoverReferenceVisible.value = !popoverReferenceVisible.value;
  }

  function onDetailsClick() {
    console.log('Details clicked');
  }
</script>

<template>
  <AcvPopover
    :reference-el="popoverReference"
    :model-value="popoverReferenceVisible"
    :width="300"
  >
    <div class="mx-24 my-16 acv-text acv-text--body-24">
      The system is preparing your report.
      Your report will be sent to you as soon
      as it is ready<br>
      <AcvButton
        type="ghost"
        tabindex="0"
        class="mt-8 move-left"
        @keydown.enter="onDetailsClick"
        @click="onDetailsClick"
      >
        Details
      </AcvButton>
    </div>
  </AcvPopover>
  <AcvButton
    ref="popoverReference"
    :class="{ 'is-selected': popoverReferenceVisible }"
    @click="handleTogglePopoverVisible"
  >
    Button
  </AcvButton>
</template>
