import ElOption from '../select/src/option.vue';


ElOption.install = function (Vue) {
  Vue.component(ElOption.name, ElOption);
};

export default ElOption;
