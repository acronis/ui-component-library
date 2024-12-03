import { createApp, h } from 'vue';
import Demo from './Demo.vue';

// import global figma-ds styles
import './assets/style/index.css';

const app = createApp({
  render: () => h(Demo),
});

app.mount('#app');
