<script setup>
  import { ref } from 'vue';
  import phaethon from '../__data__/data.phaethon.txt?raw';
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';

  const dialogIsVisible = ref(true);
</script>

<template>
  <AcvButton @click="dialogIsVisible = true">
    Show dialog with <strong>Small</strong> width
  </AcvButton>
  <AcvDialog
    v-model="dialogIsVisible"
    width="small"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <pre class="acv-text acv-text--size-caption">
{{ phaethon }}
      </pre>
    </div>
  </AcvDialog>
</template>
