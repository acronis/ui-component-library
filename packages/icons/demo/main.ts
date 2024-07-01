import { createApp } from 'vue';
import './styles/index.css';

// import { createNotificationService } from '@acronis-platform/ui-component-library';
import App from './App.vue';

// import '@acronis-platform/ui-component-library/styles/notifications.css';
// import '@acronis-platform/ui-component-library/styles/animations.css';

const app = createApp(App);
// export const push = createNotificationService(app, {
//   position: 'bottom-right',
//   limit: 3,
// });
app.mount('#app');
