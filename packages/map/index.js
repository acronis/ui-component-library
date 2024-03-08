import ElMap from './src/map.vue';


ElMap.install = function (Vue) {
  Vue.component(ElMap.name, ElMap);
};

export default ElMap;
