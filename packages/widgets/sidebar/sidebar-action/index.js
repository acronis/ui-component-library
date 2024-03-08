import ElSidebarAction from './src/sidebar-action.vue';


ElSidebarAction.install = function (Vue) {
  Vue.component(ElSidebarAction.name, ElSidebarAction);
};

export default ElSidebarAction;
