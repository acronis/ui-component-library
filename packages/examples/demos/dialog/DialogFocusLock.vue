<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';

  const dialogIsVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogIsVisible = true">
    Show dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogIsVisible"
    width="small"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <AcvButton>Button 1</AcvButton>
      <AcvButton>Button 2</AcvButton>
      <AcvButton>Button 3</AcvButton>
      <AcvButton>Button 4</AcvButton>
    </div>
  </AcvDialog>
</template>
