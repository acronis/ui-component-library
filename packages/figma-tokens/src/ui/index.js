import { createApp } from 'vue';

// import FigmaDS from '@acronis-platform/figma-ds-vue-plugin';
import App from './components/app.vue';

window.addEventListener('message', (_event) => {
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
