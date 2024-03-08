import component from '../spinner';

import service from './src';
import directive from './src/directive';

export default {
  install(app) {
    app.component('ElLoading', component);
    app.directive('loading', directive);
    // Vue.prototype.$loading = service;
  },
  component,
  directive: { loading: directive },
  service
};
