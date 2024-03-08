import ElMenu from './src/menu.vue';


ElMenu.install = function (Vue) {
  Vue.component(ElMenu.name, ElMenu);
};

export default ElMenu;
