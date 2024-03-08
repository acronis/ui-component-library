import ElCollapse from './src/collapse.vue';


ElCollapse.install = function (Vue) {
  Vue.component(ElCollapse.name, ElCollapse);
};

export default ElCollapse;
