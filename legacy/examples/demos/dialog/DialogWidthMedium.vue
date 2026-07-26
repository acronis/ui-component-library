<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';
  import phaethon from '../../__mocks__/data.phaethon.txt?raw';

  const dialogIsVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogIsVisible = true">
    Show dialog with Medium width
  </AcvButton>
  <AcvDialog
    v-model="dialogIsVisible"
    width="medium"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <pre class="acv-text acv-text--size-caption">
{{ phaethon }}
      </pre>
    </div>
  </AcvDialog>
</template>
