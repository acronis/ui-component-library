<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';

  const dialogBasicVisible = ref(false);
  function handleClose(done) {
    // eslint-disable-next-line no-alert
    const result = confirm('Are you sure to close this dialog?');
    if (result) {
      done();
    }
  }
</script>

<template>
  <AcvButton @click="dialogBasicVisible = true">
    Show Basic Dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogBasicVisible"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
    :before-close="handleClose"
  >
    <div class="px-24 py-16">
      This is a message
    </div>
    <template #footer>
      <div class="px-24 py-16">
        <AcvButton
          variant="outline"
          @click="dialogBasicVisible = false"
        >
          Cancel
        </AcvButton>
        <AcvButton @click="dialogBasicVisible = false">
          Ok
        </AcvButton>
      </div>
    </template>
  </AcvDialog>
</template>
