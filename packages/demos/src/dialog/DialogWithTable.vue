<script setup>
  import { ref } from 'vue';
  import MarkupTableSimple from '../markup-table/MarkupTableSimple.vue';
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';

  const dialogIsVisible = ref(true);
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
    <MarkupTableSimple />
  </AcvDialog>
</template>
