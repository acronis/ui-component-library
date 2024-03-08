import Main from './src/main.vue';


Main.install = function (app) {
  app.component(Main.name, Main);
};

export default Main;
