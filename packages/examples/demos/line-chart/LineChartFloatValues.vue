<script setup>
  import AcvLineChart from '@/components/line-chart/lineChart.vue';

  const floatValuesData = {
    series: [
      {
        name: 'Critical',
        points: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
      }
    ],
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  };

  const floatValuesDataTwo = {
    series: [
      {
        name: 'Success',
        points: [0.0001, 0.0002, 0.0003, 0.0004, 0.0005, 0.0006, 0.0007, 0.0008, 0.0009]
      }
    ],
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Float values"
      span="24"
    >
      <AcvLineChart
        :data="floatValuesData"
        :precision="2"
      />
    </Preview>
    <Preview
      name="Float values (percent)"
      span="24"
    >
      <AcvLineChart
        :data="floatValuesData"
        :precision="1"
        y-percent
      />
    </Preview>
    <Preview
      name="Float values (size)"
      span="24"
    >
      <AcvLineChart
        :data="floatValuesDataTwo"
        :precision="3"
      />
    </Preview>
    <Preview
      name="Float values (variable threshold)"
      span="24"
    >
      <AcvLineChart
        :data="floatValuesDataTwo"
        :precision="2"
        variable-threshold
      />
    </Preview>
  </PreviewGroup>
</template>
