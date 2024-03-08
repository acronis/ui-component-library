import ElPieChart from './src/pie-chart.vue';

ElPieChart.install = function (Vue) {
  Vue.component(ElPieChart.name, ElPieChart);
};

export default ElPieChart;
