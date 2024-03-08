import ELFilePicker from './src/file-picker.vue';


ELFilePicker.install = function (Vue) {
  Vue.component(ELFilePicker.name, ELFilePicker);
};

export default ELFilePicker;
