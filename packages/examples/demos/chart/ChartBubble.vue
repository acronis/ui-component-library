<script setup>
  import AcvChart from '@/components/chart/chart.vue';

  const data = {
    datasets: [{
      label: 'First Dataset',
      data: [{
        x: 20,
        y: 30,
        r: 15
      }, {
        x: 40,
        y: 10,
        r: 10
      }],
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };
</script>

<template>
  <AcvChart
    type="bubble"
    dataset-id-key="test"
    :data="data"
  />
</template>
