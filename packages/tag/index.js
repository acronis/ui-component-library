import ElTag from './src/tag.vue';


ElTag.install = function (Vue) {
  Vue.component(ElTag.name, ElTag);
};

export default ElTag;
