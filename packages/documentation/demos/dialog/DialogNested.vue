<script setup>
  import { ref } from 'vue';

  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';

  const dialogIsVisible = ref(false);
  const nestedDialogIsVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogIsVisible = true">
    Show Root Dialog
  </AcvButton>
  <AcvButton @click="nestedDialogIsVisible = true">
    Show Nested Dialog
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
        Nested content
        <AcvButton @click="dialogIsVisible = true">
          Open root dialog
        </AcvButton>
      </AcvDialog>
    </div>
  </AcvDialog>
</template>
