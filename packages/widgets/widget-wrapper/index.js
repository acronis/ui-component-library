import ElWidgetWrapper from './src/widget-wrapper.vue';

ElWidgetWrapper.install = function (Vue) {
  Vue.component(ElWidgetWrapper.name, ElWidgetWrapper);
};

export default ElWidgetWrapper;
