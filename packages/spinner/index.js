import Spinner from './src/spinner.vue';


Spinner.install = function (Vue) {
  Vue.component(Spinner.name, Spinner);
};

export default Spinner;
