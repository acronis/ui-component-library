import ElCarouselItem from '../carousel/src/item.vue';


ElCarouselItem.install = function (Vue) {
  Vue.component(ElCarouselItem.name, ElCarouselItem);
};

export default ElCarouselItem;
