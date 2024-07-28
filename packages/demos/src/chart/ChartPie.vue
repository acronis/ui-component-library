<script setup>
  import AcvChart from '@/components/chart/chart.vue';

  const data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
</script>

<template>
  <AcvChart
    type="pie"
    dataset-id-key="test"
    :data="data"
  />
</template>
