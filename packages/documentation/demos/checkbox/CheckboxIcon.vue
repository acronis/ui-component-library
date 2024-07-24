<script setup>
  import { reactive } from 'vue';
  import { IconCheckCircle32 } from '@acronis-platform/icons/check';
  import { IconClose16 } from '@acronis-platform/icons/close';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  const checked = reactive([false, false]);
</script>

<template>
  <div class="grid grid-rows-2 gap-y-3">
    <AcvCheckbox
      v-model="checked[0]"
    >
      <template #icon>
        <IconClose16 v-show="!checked[0]" />
        <IconCheckCircle32 v-show="checked[0]" />
      </template>
    </AcvCheckbox>

    <AcvCheckbox
      v-model="checked[0]"
      icon="i-bx-check-double"
    />
  </div>
</template>
