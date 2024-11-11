<script setup>
  import AcvLineChart from '@/components/line-chart/lineChart.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';

  const onePointData = {
    series: [
      {
        name: 'Critical',
        points: [1]
      }
    ],
    labels: ['2021-01-01']
  };

  const unitDataWithLowValues = {
    series: [
      {
        name: 'Low',
        points: [0.0001, 0.0002, 0.0003, 0.0004, 0.0005, 0.0006, 0.0007, 0.0008, 0.0009]
      }
    ],
  };

  const partialNullData = {
    series: [
      {
        name: 'Critical',
        points: [10, 20, null, 40, 50, 60, 70, 80]
      }
    ]
  };

  const edgeData = {
    series: [
      {
        name: 'Critical',
        points: []
      }
    ],
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Data with only one point"
      span="24"
    >
      <AcvWidgetWrapper title="Data with only one point">
        <AcvLineChart
          area
          :data="onePointData"
          :data-point-on-hover="true"
        />
      </AcvWidgetWrapper>
    </Preview>
    <Preview
      name="Data with restricted number of ticks on the Y axis"
      span="24"
    >
      <AcvWidgetWrapper title="Data with restricted number of ticks on the Y axis">
        <AcvLineChart
          area
          :data="unitDataWithLowValues"
          :data-point-on-hover="true"
        />
      </AcvWidgetWrapper>
    </Preview>
    <Preview
      name="Partial null data"
      span="24"
    >
      <AcvWidgetWrapper title="Partial null data">
        <AcvLineChart
          :data="partialNullData"
          variable-threshold
        />
      </AcvWidgetWrapper>
    </Preview>
    <Preview
      name="Edge data"
      span="24"
    >
      <AcvWidgetWrapper title="Edge data">
        <AcvLineChart
          :data="edgeData"
          data-point-on-hover
          variable-threshold
        />
      </AcvWidgetWrapper>
    </Preview>
  </PreviewGroup>
</template>
