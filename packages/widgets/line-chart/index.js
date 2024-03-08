import ElLineChart from './src/line-chart.vue';

ElLineChart.install = function (Vue) {
  Vue.component(ElLineChart.name, ElLineChart);
};

export default ElLineChart;
