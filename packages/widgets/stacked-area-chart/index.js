import ElStackedAreaChart from './src/stacked-area-chart.vue';

ElStackedAreaChart.install = function (Vue) {
  Vue.component(ElStackedAreaChart.name, ElStackedAreaChart);
};

export default ElStackedAreaChart;
