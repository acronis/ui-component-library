import ElSidebarLayout from './src/sidebar-layout.vue';


ElSidebarLayout.install = function (Vue) {
  Vue.component(ElSidebarLayout.name, ElSidebarLayout);
};

export default ElSidebarLayout;
