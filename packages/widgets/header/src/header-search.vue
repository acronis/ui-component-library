<template>
  <div
    class="el-header__aside-item el-header__aside-item--search"
  >
    <el-divider :vertical="24" />
    <el-search
      v-model="keyword"
      class="el-header__search"
      suggestions-class="el-header__suggestions"
      :style="width && { width }"
      autocomplete
      :fetch-suggestions="querySearch"
      :placeholder="placeholder"
      type="embedded-large"
      @select="onSelect"
      @search-collapse="onSearchCollapse"
    />
    <el-divider :vertical="24" />
  </div>
</template>

<script>
  import ElSearch from 'packages/search';

  export default {
    name: 'ElHeaderSearch',

    components: {
      ElSearch
    },

    componentName: 'ElHeaderSearch',

    inject: {
      searchCollapse: { default: undefined }
    },

    props: {
      querySearch: {
        type: Function,
        required: true
      },
      onSelect: {
        type: Function,
        required: true
      },
      placeholder: {
        type: String
      },
      width: {
        type: String
      }
    },

    data() {
      return {
        keyword: ''
      };
    },

    methods: {
      onSearchCollapse: function (isCollapsed) {
        if (this.searchCollapse) this.searchCollapse(isCollapsed);
      }
    }
  };
</script>
