<script setup>
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import { reactive } from 'vue';

  const checked = reactive([false, false, false, false, false]);
</script>

<template>
  <div class="grid gap-y-3">
    <AcvCheckbox
      v-model="checked[0]"
      color="primary"
    >
      Primary
    </AcvCheckbox>

    <AcvCheckbox
      v-model="checked[1]"
      color="success"
    >
      Success
    </AcvCheckbox>

    <AcvCheckbox
      v-model="checked[2]"
      color="info"
    >
      Info
    </AcvCheckbox>

    <AcvCheckbox
      v-model="checked[3]"
      color="warning"
    >
      Warning
    </AcvCheckbox>

    <AcvCheckbox
      v-model="checked[4]"
      color="danger"
    >
      Danger
    </AcvCheckbox>
  </div>
</template>

<style scoped>
.acv-checkbox {
  margin-right: 8px;
}
</style>
