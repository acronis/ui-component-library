<script setup>
  import AcvTabPane from '@/components/tab-pane/tab-pane.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';

  import { ref } from 'vue';

  const interceptionValue = ref('middle');

  function handleInput(value) {
    if (value === 'left') {
      // eslint-disable-next-line no-alert
      const confirmed = confirm('Switch to tab left?');
      if (!confirmed) {
        console.log(`intercepted: ${value}`);
        return;
      }
    }
    console.log(value);
    interceptionValue.value = value;
  }
</script>

<template>
  <AcvTabs
    v-model="interceptionValue"
    @update:model-value="handleInput"
  >
    <AcvTabPane
      label="Left"
      name="left"
    >
      <span class="el-text el-text--body-32 mx-24">Left</span>
    </AcvTabPane>
    <AcvTabPane
      label="Middle"
      name="middle"
    >
      <span class="el-text el-text--body-32 mx-24">Middle</span>
    </AcvTabPane>
    <AcvTabPane
      label="Right"
      name="right"
    >
      <span class="el-text el-text--body-32 mx-24">Right</span>
    </AcvTabPane>
  </AcvTabs>
</template>
