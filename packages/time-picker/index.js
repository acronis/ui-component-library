import ElTimePicker from './src/time-picker.vue';


ElTimePicker.install = function (Vue) {
  Vue.component(ElTimePicker.name, ElTimePicker);
};

export default ElTimePicker;
