import ElCol from './src/col';


ElCol.install = function (app) {
  app.component(ElCol.name, ElCol);
};

export default ElCol;
