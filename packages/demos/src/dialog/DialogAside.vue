<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvDialog from '@/components/dialog/dialog.vue';
  import AcvStepper from '@/components/stepper/stepper.vue';
  import AcvStepperItem from '@/components/stepper-item/stepperItem.vue';
  import { ref } from 'vue';

  const dialogVisible = ref(false);
  const stepper = ref(0);

  function handleClose(done) {
    // eslint-disable-next-line no-alert
    const result = confirm('Are you sure to close this dialog?');
    if (result) {
      done();
    }
  }
</script>

<template>
  <AcvButton @click="dialogVisible = true">
    Show Basic Dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogVisible"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
    :before-close="handleClose"
  >
    <div class="px-24 py-16">
      This is a message
    </div>
    <template #aside>
      <AcvStepper v-model="stepper">
        <AcvStepperItem>Patches</AcvStepperItem>
        <AcvStepperItem>Post-install options</AcvStepperItem>
      </AcvStepper>
    </template>
    <template #footer>
      <AcvButton
        v-if="stepper !== 0"
        type="secondary"
        @click="stepper > 0 ? --stepper : stepper = 0"
      >
        Back
      </AcvButton>
      <AcvButton
        v-if="stepper === 0"
        @click="stepper < 1 ? ++stepper : stepper = 0"
      >
        Next
      </AcvButton>
      <AcvButton
        v-else
        @click="dialogVisible = false"
      >
        Install patches
      </AcvButton>
    </template>
  </AcvDialog>
</template>
