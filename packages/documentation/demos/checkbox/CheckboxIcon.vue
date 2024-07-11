<script setup>
  import { reactive } from 'vue';
  import { ICheckCircleLarge, ITimesCircleOLarge } from '@acronis-platform/icons';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  const checked = reactive([false, false]);
</script>

<template>
  <div class="grid grid-rows-2 gap-y-3">
    <AcvCheckbox
      v-model="checked[0]"
    >
      <template #icon>
        <ITimesCircleOLarge v-show="!checked[0]" />
        <ICheckCircleLarge v-show="checked[0]" />
      </template>
    </AcvCheckbox>

    <AcvCheckbox
      v-model="checked[0]"
      icon="i-bx-check-double"
    />
  </div>
</template>
