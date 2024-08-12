<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';
  import AcvTab from '@/components/tabs/tab.vue';
</script>

<template>
  <AcvTabs>
    <AcvTab title="Label">
      <template #label>
        Slotted Label
      </template>
      Test
    </AcvTab>
    <AcvTab title="Label 2">
      Test 2
    </AcvTab>
  </AcvTabs>
</template>
