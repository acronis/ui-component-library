import Carousel from './src/main.vue';


Carousel.install = function (Vue) {
  Vue.component(Carousel.name, Carousel);
};

export default Carousel;
