<template>
  <preview-group class="qa-search-basic">
    <preview name="Default" span="8">
      <el-search
        v-model="search"
        placeholder="Search">
      </el-search>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';

import ElSearch from 'packages/search';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const search = ref('');
</script>
