import ElSidebarPanel from './src/sidebar-panel.vue';


ElSidebarPanel.install = function (Vue) {
  Vue.component(ElSidebarPanel.name, ElSidebarPanel);
};

export default ElSidebarPanel;
