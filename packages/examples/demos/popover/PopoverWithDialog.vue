<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import AcvPopover from '@/components/popover/popover.vue';
  import { ref } from 'vue';

  const dpVisible = ref(false);
  const dialogVisible = ref(false);
  const dialog1Visible = ref(false);
  const dp1Visible = ref(false);
  const dp1 = ref(null);
  const dp2 = ref(null);

  function onDialogClick() {
    dialogVisible.value = !dialogVisible.value;
  }

  function onDialogOneClick() {
    dialog1Visible.value = !dialog1Visible.value;
  }

  function handleDPOneVisible() {
    dp1Visible.value = !dp1Visible.value;
  }

  function handleDPVisible(val) {
    dpVisible.value = val;
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Popover with dialog"
      span="6"
    >
      <AcvPopover
        ref="dp1"
        width="300"
        @show="handleDPVisible(true)"
        @hide="handleDPVisible(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8 move-left"
            @keydown.enter="onDialogClick"
            @click="onDialogClick"
          >
            Details
          </AcvButton>
        </div>
        <template #reference>
          <AcvButton
            type="secondary"
            :class="{ 'is-selected': dpVisible }"
          >
            Button
          </AcvButton>
        </template>
      </AcvPopover>
      <AcvDialog
        v-model:visible="dialogVisible"
        width-size="small"
        height-size="fixed-auto"
        title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
      >
        <div class="px-24 py-16">
          <div>
            <div class="acv-text acv-text--size-xs">
              Minimal Height
            </div>
          </div>
        </div>
        <template #footer-aside>
          <span class="acv-text acv-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. </span>
        </template>
        <template #footer>
          <AcvButton
            type="secondary"
            @click="onDialogClick"
          >
            Cancel
          </AcvButton>
          <AcvButton @click="onDialogClick">
            Ok
          </AcvButton>
        </template>
      </AcvDialog>
    </Preview>
    <Preview
      name="Popover with dialog"
      span="6"
    >
      <AcvPopover
        ref="dp2"
        width="300"
        @show="handleDPOneVisible(true)"
        @hide="handleDPOneVisible(false)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          The system is preparing your report.
          Your report will be sent to you as soon
          as it is ready<br>
          <AcvButton
            type="ghost"
            tabindex="0"
            class="mt-8 move-left"
            @keydown.enter="onDialogOneClick"
            @click="onDialogOneClick"
          >
            Details
          </AcvButton>
        </div>
        <template #reference>
          <AcvButton
            type="primary"
            :class="{ 'is-selected': dp1Visible }"
          >
            Button
          </AcvButton>
        </template>
      </AcvPopover>
      <AcvDialog
        v-model:visible="dialog1Visible"
        width-size="small"
        height-size="fixed-auto"
        title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
      >
        <div class="px-24 py-16">
          <div>
            <div class="acv-text acv-text--size-xs">
              Minimal Height
            </div>
          </div>
        </div>
        <template #footer-aside>
          <span class="acv-text acv-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. </span>
        </template>
        <template #footer>
          <AcvButton
            type="secondary"
            @click="onDialogOneClick"
          >
            Cancel
          </AcvButton>
          <AcvButton @click="onDialogOneClick">
            Ok
          </AcvButton>
        </template>
      </AcvDialog>
    </Preview>
  </PreviewGroup>
</template>
