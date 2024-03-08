import ElProgress from './src/progress.vue';

ElProgress.install = function (Vue) {
  Vue.component(ElProgress.name, ElProgress);
};

export default ElProgress;
