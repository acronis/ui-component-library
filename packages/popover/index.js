import { createApp } from 'vue';

import directive from './src/directive';
import Popover from './src/main.vue';

const tapp = createApp({});

tapp.directive('popover', directive);

Popover.install = function (app) {
  app.directive('popover', directive);
  app.component(Popover.name, Popover);
};
Popover.directive = directive;

export default Popover;
