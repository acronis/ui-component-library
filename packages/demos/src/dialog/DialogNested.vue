<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';

  const dialogIsVisible = ref(false);
  const nestedDialogIsVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogIsVisible = true">
    Show Root Dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogIsVisible"
    width="large"
    height="large"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <AcvButton @click="nestedDialogIsVisible = true">
        Open nested dialog
      </AcvButton>
      <AcvDialog
        v-model="nestedDialogIsVisible"
        width="small"
        height="small"
        title="Nested dialog"
      >
        <div class="pa-16">
          Nested content
        </div>
      </AcvDialog>
    </div>
  </AcvDialog>
</template>
