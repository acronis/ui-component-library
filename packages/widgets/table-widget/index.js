import ElTableWidget from './src/table-widget.vue';

ElTableWidget.install = function (Vue) {
  Vue.component(ElTableWidget.name, ElTableWidget);
};

export default ElTableWidget;
