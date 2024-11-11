<script setup>
  import AcvSearch from '@/components/search/search.vue';
  import { ref } from 'vue';

  //
  //

  const searchAutocomplete = ref('');
  const searchEmbeddedLargeAutocomplete = ref('');
  const links = [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' }
  ];
  const timeout = ref();

  function createStateFilter(queryString) {
    return (state) => {
      return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
  }

  function querySearchAsync(queryString, cb) {
    const results = queryString ? links.filter(createStateFilter(queryString)) : links;
    console.log('cb', cb);
    clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      cb(results);
    }, 500);
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default"
      span="8"
    >
      <AcvSearch
        v-model="searchAutocomplete"
        autocomplete
        :fetch-suggestions="querySearchAsync"
        placeholder="Search"
      />
    </Preview>
    <Preview
      name="Large"
      span="8"
    >
      <div class="search-demo">
        <AcvSearch
          v-model="searchEmbeddedLargeAutocomplete"
          autocomplete
          placeholder="Search"
          :fetch-suggestions="querySearchAsync"
          type="embedded-large"
        />
      </div>
    </Preview>
  </PreviewGroup>
</template>
