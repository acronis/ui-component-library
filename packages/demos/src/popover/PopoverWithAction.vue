<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
  import { ref } from 'vue';

  const popoverReference = ref(null);

  const rightStartPopover = ref(false);
  const content = ref('When the popover hides itself, it would enable to tooltip.');

  function openRightStartPopover(val) {
    rightStartPopover.value = val;
  }

  function onActionClick() {
    console.log('Action clicked');
  }
</script>

<template>
  <AcvPopover
    :reference-el="popoverReference"
    placement="top-start"
    :width="300"
    @show="openRightStartPopover(true)"
    @hide="openRightStartPopover(false)"
  >
    <div class="mx-24 my-16 acv-text acv-text--body-24">
      {{ content }}
    </div>
    <template #actions>
      <AcvButton
        type="ghost"
        @click="onActionClick"
      >
        Action inside popover
      </AcvButton>
    </template>
  </AcvPopover>
  <AcvButton
    ref="popoverReference"
    :class="{ 'is-selected': rightStartPopover }"
  >
    Button
  </AcvButton>
</template>
