<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';
  import phaethon from '../../__mocks__/data.phaethon.txt?raw';

  const dialogIsVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogIsVisible = true">
    Show clean dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogIsVisible"
  >
    <div class="px-24 py-16">
      <pre class="acv-text acv-text--size-caption">
{{ phaethon }}
      </pre>
    </div>
  </AcvDialog>
</template>
