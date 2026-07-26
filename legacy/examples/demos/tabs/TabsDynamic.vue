<script setup>
  import ElButton from '@/components/button/button.vue';
  import AcvTabPane from '@/components/tab-pane/tab-pane.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
  import { ref } from 'vue';

  const tabs = ref([
    {
      label: 'Left',
      name: 'left',
      content: 'Left content',
    },
    {
      label: 'Middle',
      name: 'middle',
      content: 'Middle content',
    },
    {
      label: 'Right',
      name: 'right',
      content: 'Right content',
    },
  ]);
  function addTab() {
    console.log('add tab');
    const count = tabs.value.length;
    tabs.value.push({
      label: `New tab ${count}`,
      name: `new ${count}`,
      content: `New content ${count}`,
    });
  }
  function removeTab() {
    console.log('remove tab');

    tabs.value.pop();
  }
</script>

<template>
  <div class="qa-tabs-basic">
    <ElButton @click="addTab">
      Add tab
    </ElButton>
    <ElButton @click="removeTab">
      Remove tab
    </ElButton>
    <AcvTabs>
      <AcvTabPane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <template #label>
          {{ tab.label }}
        </template>
        <span class="el-text el-text--body-32 mx-24">{{ tab.content }}</span>
      </AcvTabPane>
    </AcvTabs>
  </div>
</template>
