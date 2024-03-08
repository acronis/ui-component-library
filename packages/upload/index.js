import Upload from './src/ajax';


Upload.install = function (Vue) {
  Vue.component(Upload.name, Upload);
};

export default Upload;
