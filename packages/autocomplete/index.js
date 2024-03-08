import ElAutocomplete from './src/autocomplete.vue';


ElAutocomplete.install = function (Vue) {
  Vue.component(ElAutocomplete.name, ElAutocomplete);
};

export default ElAutocomplete;
