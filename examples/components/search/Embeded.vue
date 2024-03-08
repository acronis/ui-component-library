<template>
  <preview-group class="qa-search-embedded">
    <preview name="Default" span="8">
      <div class="search-demo">
        <el-search
          v-model='searchEmbeddedAutocomplete'
          placeholder="Search"
          type='embedded'>
        </el-search>
      </div>
    </preview>
    <preview name="Large" span="8">
      <div class="search-demo">
        <el-search
          v-model='searchEmbeddedLarge'
          placeholder="Search"
          type='embedded-large'>
        </el-search>
      </div>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';

import ElSearch from 'packages/search';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const searchEmbeddedAutocomplete = ref('');
const searchEmbeddedLarge = ref('');
</script>
<style lang="scss">
  @import 'themes/acronis/src/common/variables.scss';

  .search-demo {
    width: 100%;
    display: flex;
    justify-content: center;

    .el-search {
      border-color: $av-brand-lighter;
      border-style: solid;
      border-width: 0 $av-border-width-sm;
    }
  }
</style>