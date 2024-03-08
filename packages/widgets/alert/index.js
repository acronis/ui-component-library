import AlertWidget from './src/alert-widget.vue';


AlertWidget.install = function (Vue) {
  Vue.component(AlertWidget.name, AlertWidget);
};

export default AlertWidget;
