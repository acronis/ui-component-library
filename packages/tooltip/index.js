import Tooltip from './src/tooltip.vue';


Tooltip.install = function (app) {
  app.component(Tooltip.name, Tooltip);
};

export default Tooltip;
