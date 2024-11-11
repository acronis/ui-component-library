<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import AcvPopover from '@/components/popover/popover.vue';
  import { ref } from 'vue';

  const content = ref(false);
  const loadingPopover = ref(false);
  const popover7 = ref(null);

  function openLoadingPopover(val) {
    loadingPopover.value = val;
  }

  function onDetailsClick() {
    console.log('Details clicked');
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default"
      span="6"
    >
      <AcvCheckbox
        v-model="content"
        class="mb-16"
      >
        Content
      </AcvCheckbox>
      <AcvPopover
        ref="popover7"
        width="300"
        loading
        @show="openLoadingPopover(true)"
        @hide="openLoadingPopover(false)"
      >
        <div
          v-if="content"
          class="mx-24 my-16 acv-text acv-text--body-24"
        >
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
        :class="{ 'is-selected': loadingPopover }"
      >
        Button
      </AcvButton>
    </Preview>
  </PreviewGroup>
</template>
