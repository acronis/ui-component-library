<script setup>
  import AcvChart from '@/components/chart/chart.vue';

  const data = {
    datasets: [{
      label: 'Scatter Dataset',
      data: [{
        x: -10,
        y: 0
      }, {
        x: 0,
        y: 10
      }, {
        x: 10,
        y: 5
      }, {
        x: 0.5,
        y: 5.5
      }],
      backgroundColor: 'rgb(255, 99, 132)'
    }],
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom'
      }
    }
  };
</script>

<template>
  <AcvChart
    type="scatter"
    dataset-id-key="test"
    :data="data"
    :options="options"
  />
</template>
