import AboutWindow from './src/about-window.vue';


AboutWindow.install = function (Vue) {
  Vue.component(AboutWindow.name, AboutWindow);
};

export default AboutWindow;
