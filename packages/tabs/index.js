import ElTabs from './src/tabs.vue';


ElTabs.install = function (app) {
  app.component(ElTabs.name, ElTabs);
};

export default ElTabs;
