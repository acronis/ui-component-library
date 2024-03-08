import Stepper from './src/stepper.vue';


Stepper.install = function (Vue) {
  Vue.component(Stepper.name, Stepper);
};

export default Stepper;
