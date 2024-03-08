import TabNav from '../tabs/src/tab-nav.vue';

TabNav.install = function (app) {
  app.component(TabNav.name, TabNav);
};

export default TabNav;
