/* eslint-disable-next-line import/extensions */
import Notification from './src/main.js';
import NotificationComponent from './src/main.vue';


Notification.install = function (Vue) {
  Vue.prototype.$notify = Notification;
  Vue.component(NotificationComponent.name, NotificationComponent);
};

export default Notification;
