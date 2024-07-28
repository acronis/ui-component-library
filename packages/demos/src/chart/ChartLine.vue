<script setup>
  import AcvChart from '@/components/chart/chart.vue';

  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
</script>

<template>
  <AcvChart
    type="line"
    dataset-id-key="test"
    :data="data"
  />
</template>
