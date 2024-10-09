<script setup>
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import { reactive, ref } from 'vue';

  const isAgreed = ref(false);
  const checked = reactive([true, false, true, false]);
</script>

<template>
  <div class="flex flex-col mt-6">
    <AcvCheckbox v-model="isAgreed">
      I am agreed to terms and conditions
    </AcvCheckbox>
    <p class="mt-2">
      value: {{ isAgreed }}
    </p>
  </div>

  <div class="acv-grid-row acv-grid--cols-4 mt-6">
    <AcvCheckbox
      v-model="checked[0]"
      label="Checked"
    />
    <AcvCheckbox
      v-model="checked[1]"
      label="Unchecked"
    />
    <AcvCheckbox
      v-model="checked[2]"
      label="Disabled and checked"
      disabled
    />
    <AcvCheckbox
      v-model="checked[3]"
      label="Disabled"
      disabled
    />
  </div>
</template>
