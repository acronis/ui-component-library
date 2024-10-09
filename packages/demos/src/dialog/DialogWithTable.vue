<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';
  import MarkupTableSimple from '../markup-table/MarkupTableSimple.vue';

  const dialogIsVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogIsVisible = true">
    Show dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogIsVisible"
    width="large"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <MarkupTableSimple />
  </AcvDialog>
</template>
