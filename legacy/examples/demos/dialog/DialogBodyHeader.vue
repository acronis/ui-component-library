<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvDialog from '@/components/dialog/dialog.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
  import { ref } from 'vue';

  const dialogVisible = ref(false);

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
    Show Dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogBasicVisible"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
    :before-close="handleClose"
  >
    <div class="px-24 py-16">
      This is a message
    </div>
    <template #body-header>
      <AcvTabs>
        <acv-tab-pane
          label="Left"
          name="left"
        />
        <acv-tab-pane
          label="Middle"
          name="middle"
        />
        <acv-tab-pane
          label="Right"
          name="right"
        />
      </AcvTabs>
    </template>
  </AcvDialog>
</template>
