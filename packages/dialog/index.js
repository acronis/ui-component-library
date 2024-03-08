import ElDialog from './src/component.vue';


ElDialog.install = function (Vue) {
  Vue.component(ElDialog.name, ElDialog);
};

export default ElDialog;
