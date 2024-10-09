<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
  import { onMounted, ref } from 'vue';

  const popover1 = ref(null);
  const popover2 = ref(null);
  const popover3 = ref(null);
  const popover5 = ref(null);
  const popover6 = ref(null);
  const popover7 = ref(null);
  const popover8 = ref(null);
  const popover9 = ref(null);

  onMounted(() => {
    console.log('popover1', popover1.value.$el);
  });

  const rightStartPopover = ref(false);
  const rightEndPopover = ref(false);
  const topStartPopover = ref(false);
  const topEndPopover = ref(false);
  const bottomStartPopover = ref(false);
  const bottomEndPopover = ref(false);
  const leftStartPopover = ref(false);
  const leftEndPopover = ref(false);

  function openTopStartPopover(val) {
    topStartPopover.value = val;
  }
  function openTopEndPopover(val) {
    topEndPopover.value = val;
  }
  function openBottomStartPopover(val) {
    bottomStartPopover.value = val;
  }
  function openBottomEndPopover(val) {
    bottomEndPopover.value = val;
  }

  function openLeftStartPopover(val) {
    leftStartPopover.value = val;
  }
  function openLeftEndPopover(val) {
    leftEndPopover.value = val;
  }

  function openRightStartPopover(val) {
    rightStartPopover.value = val;
  }
  function openRightEndPopover(val) {
    rightEndPopover.value = val;
  }

  function onDetailsClick() {
    console.log('onDetailsClick');
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Top start"
      span="6"
    >
      <AcvPopover
        :reference-el="popover1"
        placement="top-start"
        :width="300"
        @show="openTopStartPopover(true)"
        @hide="openTopStartPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover1"
        :class="{ 'is-selected': rightStartPopover }"
      >
        Ref Button
      </AcvButton>
    </Preview>
    <Preview
      name="Top end"
      span="6"
    >
      <AcvPopover
        :reference-el="popover2"
        placement="top-end"
        :width="300"
        @show="openTopEndPopover(true)"
        @hide="openTopEndPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover2"
        :class="{ 'is-selected': topEndPopover }"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Bottom start"
      span="6"
    >
      <AcvPopover
        :reference-el="popover3"
        placement="bottom-start"
        :width="300"
        @show="openBottomStartPopover(true)"
        @hide="openBottomStartPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover3"
        :class="{ 'is-selected': bottomStartPopover }"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Bottom end"
      span="6"
    >
      <AcvPopover

        :reference-el="popover5"
        placement="bottom-end"
        :width="300"
        @show="openBottomEndPopover(true)"
        @hide="openBottomEndPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover5"
        :class="{ 'is-selected': bottomEndPopover }"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Left start"
      span="6"
    >
      <AcvPopover

        :reference-el="popover6"
        placement="left-start"
        :width="300"
        @show="openLeftStartPopover(true)"
        @hide="openLeftStartPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover6"
        :class="{ 'is-selected': leftStartPopover }"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Left end"
      span="6"
    >
      <AcvPopover

        :reference-el="popover7"
        placement="left-end"
        :width="300"
        @show="openLeftEndPopover(true)"
        @hide="openLeftEndPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover7"
        :class="{ 'is-selected': leftEndPopover }"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Right start"
      span="6"
    >
      <AcvPopover

        :reference-el="popover8"
        placement="right-start"
        :width="300"
        @show="openRightStartPopover(true)"
        @hide="openRightStartPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover8"
        :class="{ 'is-selected': rightStartPopover }"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Right end"
      span="6"
    >
      <AcvPopover

        :reference-el="popover9"
        placement="right-end"
        :width="300"
        @show="openRightEndPopover(true)"
        @hide="openRightEndPopover(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8"
            @keydown.enter="onDetailsClick"
            @click="onDetailsClick"
          >
            Details
          </AcvButton>
        </div>
      </AcvPopover>
      <AcvButton
        ref="popover9"
        :class="{ 'is-selected': rightEndPopover }"
      >
        Button
      </AcvButton>
    </Preview>
  </PreviewGroup>
</template>

<style scoped>
.is-selected {
  background-color: hsl(155deg 76% 44%);
}
</style>
