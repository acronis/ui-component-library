import ElFileBrowser from './src/file-browser.vue';

ElFileBrowser.install = function (Vue) {
  Vue.component(ElFileBrowser.name, ElFileBrowser);
};

export default ElFileBrowser;
