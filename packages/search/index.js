import ElSearch from './src/search.vue';


ElSearch.install = function (Vue) {
  Vue.component(ElSearch.name, ElSearch);
};

export default ElSearch;
