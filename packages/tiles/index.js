import ElTiles from './src/tiles';


ElTiles.install = function (Vue) {
  Vue.component(ElTiles.name, ElTiles);
};

export default ElTiles;
