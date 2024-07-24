import { createApp } from 'vue';

// import FigmaDS from '@ui-kit/figma-ds-vue-plugin';
import App from './components/app.vue';

window.addEventListener('message', function onMessage(event) {
  /* ... */
});

const app = createApp(App);
// app.use(FigmaDS);
// app.config.errorHandler = function onError(err) {
//   // parent.postMessage({
//   //   pluginMessage: {
//   //     type: 'app-error',
//   //     err,
//   //   },
//   // }, '*');
// };

app.mount('#app');
