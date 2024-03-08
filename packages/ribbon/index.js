import Ribbon from './src/main.vue';

Ribbon.install = function (Vue) {
  Vue.component(Ribbon.name, Ribbon);
};

export default Ribbon;
