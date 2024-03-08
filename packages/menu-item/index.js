import ElMenuItem from '../menu/src/menu-item.vue';


ElMenuItem.install = function (Vue) {
  Vue.component(ElMenuItem.name, ElMenuItem);
};

export default ElMenuItem;
