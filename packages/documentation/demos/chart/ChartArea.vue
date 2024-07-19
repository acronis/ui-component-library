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
    datasets: [
      {
        label: 'origin',
        fill: 'origin', // 0: fill to 'origin'
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: '+2',
        fill: '+2', // 1: fill to dataset 3
        data: [60, 54, 54, 81, 43, 23, 32]
      },
      {
        label: 1,
        fill: 1, // 2: fill to dataset 1
        data: [34, 21, 14, 88, 53, 7, 22]
      },
      {
        label: 'no fill',
        fill: false,
        data: [10, 11, 12, 11, 8, 4, 2]
      }, // 3: no fill
      {
        label: '-2',
        fill: '-2',
        data: [63, 57, 78, 79, 54, 53, 38]
      }, // 4: fill to dataset 2
      {
        label: 'value 25',
        fill: { value: 25 },
        data: [21, 24, 27, 18, 32, 21, 14]
      } // 5: fill to axis value 25
    ]
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
    type="line"
    dataset-id-key="test"
    :data="data"
    :options="options"
  />
</template>
