<script setup>
  import { ref } from 'vue';
  import networkOneData from '../__data__/data.mock.network.one.json';
  import networkTwoData from '../__data__/data.mock.network.two.json';
  import AcvButton from '@/components/button/button.vue';
  import AcvLineChart from '@/widgets/line-chart/lineChart.vue';

  const data = ref(networkOneData);
  const dataChanged = ref(false);

  function changeData() {
    data.value = networkTwoData;

    dataChanged.value = true;
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="with percent scale"
      span="24"
    >
      <AcvLineChart
        :data="data"
        y-percent
        @timeline-click="onTimelineClick"
        @legend-click="onLegendClick"
      />
      <AcvButton
        :disabled="dataChanged"
        @click="changeData"
      >
        Change data
      </AcvButton>
    </Preview>
  </PreviewGroup>
</template>
