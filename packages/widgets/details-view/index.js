import ElDetailsView from '../details/src/details-view.vue';


ElDetailsView.install = function (Vue) {
  Vue.component(ElDetailsView.name, ElDetailsView);
};

export default ElDetailsView;
