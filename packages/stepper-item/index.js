import StepperItem from '../stepper/src/stepper-item.vue';


StepperItem.install = function (Vue) {
  Vue.component(StepperItem.name, StepperItem);
};

export default StepperItem;
