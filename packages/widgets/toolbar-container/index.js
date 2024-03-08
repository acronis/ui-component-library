import ToolbarContainer from '../toolbar/src/toolbarContainer.vue';


ToolbarContainer.install = function (Vue) {
  Vue.component('ElToolbarContainer', ToolbarContainer);
};

export default ToolbarContainer;
