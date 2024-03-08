import ElSubmenu from '../menu/src/submenu.vue';


ElSubmenu.install = function (Vue) {
  Vue.component(ElSubmenu.name, ElSubmenu);
};

export default ElSubmenu;
