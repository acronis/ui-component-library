<script setup>
  // import AcpAutocomplete from '@/components/autocomplete/autocomplete.vue';
  import { onMounted, ref } from 'vue';

  const state = ref('');
  const links = ref([]);

  function createStateFilter(queryString) {
    return filteredState => (filteredState.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
  }

  function querySearch(queryString, cb) {
    const results = queryString ? links.value.filter(createStateFilter(queryString)) : links.value;

    cb(results);
  }

  function handleSelect(item) {
    console.log(item);
  }

  function loadAll() {
    return [
      { value: 'vue', link: 'https://github.com/vuejs/vue' },
      { value: 'element', link: 'https://github.com/ElemeFE/element' },
      { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
      { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
      { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
      { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
      { value: 'babel', link: 'https://github.com/babel/babel' }
    ];
  }

  onMounted(() => {
    links.value = loadAll();
  });
</script>

<template>
  <AcpAutocomplete
    v-model="state"
    style="width: 100%"
    :fetch-suggestions="querySearch"
    label="List suggestions when activated"
    @select="handleSelect"
  />
</template>
