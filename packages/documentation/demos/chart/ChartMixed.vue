<script setup>
  import AcvChart from '@/components/chart/chart.vue';

  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April'
    ],
    datasets: [{
      type: 'bar',
      label: 'Bar Dataset',
      data: [10, 20, 30, 40],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)'
    }, {
      type: 'line',
      label: 'Line Dataset',
      data: [50, 50, 50, 50],
      fill: false,
      borderColor: 'rgb(54, 162, 235)'
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
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
