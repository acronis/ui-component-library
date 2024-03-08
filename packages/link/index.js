import ElLink from './src/link.vue';


ElLink.install = function (Vue) {
  Vue.component(ElLink.name, ElLink);
};

export default ElLink;
