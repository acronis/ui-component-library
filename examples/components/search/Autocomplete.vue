<template>
  <preview-group>
    <preview name="Default" span="8">
      <el-search autocomplete
        v-model='searchAutocomplete'
        :fetch-suggestions="querySearchAsync"
        placeholder="Search">
      </el-search>
    </preview>
    <preview name="Large" span="8">
      <div class="search-demo">
        <el-search autocomplete
          v-model='searchEmbeddedLargeAutocomplete'
          placeholder="Search"
          :fetch-suggestions="querySearchAsync"
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

const searchAutocomplete = ref('');
const searchEmbeddedLargeAutocomplete = ref('');
const links = [
  { "value": "vue", "link": "https://github.com/vuejs/vue" },
  { "value": "element", "link": "https://github.com/ElemeFE/element" },
  { "value": "cooking", "link": "https://github.com/ElemeFE/cooking" },
  { "value": "mint-ui", "link": "https://github.com/ElemeFE/mint-ui" },
  { "value": "vuex", "link": "https://github.com/vuejs/vuex" },
  { "value": "vue-router", "link": "https://github.com/vuejs/vue-router" },
  { "value": "babel", "link": "https://github.com/babel/babel" }
];
const timeout = ref();

const createStateFilter = (queryString) => {
  return (state) => {
    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
  };
};

const querySearchAsync = (queryString, cb) => {
  var results = queryString ? links.filter(createStateFilter(queryString)) : links;
  console.log('cb', cb)
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    cb(results);
  }, 500);
};

</script>
