import NotificationComponent from '../notification/src/main.vue';


NotificationComponent.install = function (Vue) {
  Vue.component(NotificationComponent.name, NotificationComponent);
};

export default NotificationComponent;
