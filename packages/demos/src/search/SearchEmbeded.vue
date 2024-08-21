<script setup>
  import { ref } from 'vue';

  //
  //
  import AcvSearch from '@/components/search/search.vue';

  const searchEmbeddedAutocomplete = ref('');
  const searchEmbeddedLarge = ref('');
</script>

<template>
  <PreviewGroup class="qa-search-embedded">
    <Preview
      name="Default"
      span="8"
    >
      <div class="search-demo">
        <AcvSearch
          v-model="searchEmbeddedAutocomplete"
          placeholder="Search"
          type="embedded"
        />
      </div>
    </Preview>
    <Preview
      name="Large"
      span="8"
    >
      <div class="search-demo">
        <AcvSearch
          v-model="searchEmbeddedLarge"
          placeholder="Search"
          type="embedded-large"
        />
      </div>
    </Preview>
  </PreviewGroup>
</template>

<style scoped>
  .search-demo {
    width: 100%;
    display: flex;
    justify-content: center;

    .acv-search {
      border-color: var(--acv-color-primary-lighter);
      border-style: solid;
      border-width: 0 var(--acv-border-regular);
    }
  }
</style>
