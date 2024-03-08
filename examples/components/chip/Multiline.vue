<template>
  <el-chip
    v-for="item in items"
    :key="item.id"
    :icon="item.icon"
    :show-Close="item.showClose"
    :show-hover-hint="item.showHoverHint"
    @click="handleClick(item.id)">
    {{ item.text }}
  </el-chip>
</template>

<script setup>
import { ref } from 'vue';
import ElChip from 'packages/chip';

const items = ref([
  { id: '1', icon: "i-console-o--16", text: "Text" },
  { id: '2', text: "Text" },
  { id: '3', icon: "i-console-o--16", text: "Text" },
  { id: '4', text: "Text", showClose: false },
  { id: '5', icon: "i-console-o--16", text: "Text", showClose: false },
  { id: '6', icon: "i-omnivoice-sms-packages-o--16", text: "www.mydomain.com/pathofpage/pathofpage", showHoverHint: true },
  { id: '7', icon: "i-console-o--16", text: "Text", showClose: false },
  { id: '8', icon: "i-console-o--16", text: "Text" },
  { id: '9', text: "Text", showClose: false },
  { id: '10', icon: "i-omnivoice-sms-packages-o--16", text: "www.mydomain.com/pathofpage/pathofpage", showHoverHint: true },
  { id: '11', icon: "i-console-o--16", text: "Text" },
  { id: '12', icon: "i-console-o--16", text: "Text" },
  { id: '13', text: "Text" },
  { id: '14', icon: "i-omnivoice-sms-packages-o--16", text: "www.mydomain.com/pathofpage/pathofpage", showHoverHint: true }
]);

const handleClick = (id) => {
  items.value = items.value.filter((item) => item.id !== id);
}
</script>
