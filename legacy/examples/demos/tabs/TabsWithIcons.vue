<script setup>
  import AcvTabPane from '@/components/tab-pane/tab-pane.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
  import { IconBell24 } from '@acronis-platform/icons/bell';
  import { IconSettings16 } from '@acronis-platform/icons/settings';
  import { IconUser16 } from '@acronis-platform/icons/user';
  import { h } from 'vue';

  const tabs = [
    { label: 'Left', icon: h(IconUser16) },
    { label: 'Middle', icon: h(IconBell24) },
    { label: 'Right', icon: h(IconSettings16) },
  ];
</script>

<template>
  <AcvTabs>
    <AcvTabPane
      v-for="tab in tabs"
      :key="tab.label"
      :label="tab.label"
      :name="tab.label"
      :icon="tab.icon"
    >
      <span class="el-text el-text--body-32 mx-24">{{ tab.label }}</span>
    </AcvTabPane>
  </AcvTabs>
</template>
