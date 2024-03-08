import ElLiveTracker from './src/live-tracker.vue';

ElLiveTracker.install = function (Vue) {
  Vue.component(ElLiveTracker.name, ElLiveTracker);
};

export default ElLiveTracker;
