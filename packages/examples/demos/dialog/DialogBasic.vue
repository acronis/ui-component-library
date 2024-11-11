<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';
  import phaethon from '../../__mocks__/data.phaethon.txt?raw';

  const dialogBasicVisible = ref(false);
</script>

<template>
  <AcvButton @click="dialogBasicVisible = true">
    Show Basic Dialog
  </AcvButton>
  <AcvDialog
    v-model="dialogBasicVisible"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      {{ phaethon }}
    </div>

    <template #footer-aside>
      <span class="acv-text acv-text--body-regular">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem commodi deleniti dolorem dolorum eligendi</span>
    </template>
    <template #footer>
      <AcvButton
        variant="outline"
        @click="dialogBasicVisible = false"
      >
        Cancel
      </AcvButton>
      <AcvButton @click="dialogBasicVisible = false">
        Done
      </AcvButton>
    </template>
  </AcvDialog>
</template>
