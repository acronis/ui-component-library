import ElTooltipWrapper from './tooltip-wrapper.vue';


ElTooltipWrapper.install = function (Vue) {
  Vue.component(ElTooltipWrapper.name, ElTooltipWrapper);
};

export default ElTooltipWrapper;
