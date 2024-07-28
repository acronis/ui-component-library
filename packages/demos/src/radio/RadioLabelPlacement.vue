<script setup>
  import { ref } from 'vue';
  import AcvRadio from '@/components/radio/radio.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';

  const picked = ref('top');
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-4">
    <AcvFormItem
      v-model="picked"
      :control="AcvRadio"
      title="Top placement"
      title-placement="top"
      value="top"
    />
    <AcvFormItem
      v-model="picked"
      :control="AcvRadio"
      title="Left placement"
      title-placement="left"
      value="left"
    />
    <AcvFormItem
      v-model="picked"
      :control="AcvRadio"
      title="Bottom placement"
      title-placement="bottom"
      value="bottom"
    />
    <AcvFormItem
      v-model="picked"
      :control="AcvRadio"
      title="Right placement"
      title-placement="right"
      value="right"
    />
  </div>
</template>
