import ElMultiSearch from './src/multi-search.vue';


ElMultiSearch.install = function (Vue) {
  Vue.component(ElMultiSearch.name, ElMultiSearch);
};

export default ElMultiSearch;
