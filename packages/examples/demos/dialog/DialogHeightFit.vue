<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';
  import Odes from '../../__mocks__/data.odes.4.11.txt?raw';

  const dialogBasicVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogBasicVisible = true">
    Show Dialog with fit height
  </AcvButton>
  <AcvDialog
    v-model="dialogBasicVisible"
    height="fit"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <pre class="acv-text acv-text--size-caption">
{{ Odes }}
      </pre>
    </div>
  </AcvDialog>
</template>
