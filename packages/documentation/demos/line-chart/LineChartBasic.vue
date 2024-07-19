<script>
  import networkOneData from '../__data__/data.mock.network.one.json';
  import AcvLineChart from '@/widgets/line-chart/lineChart.vue';

  export default {
    components: { AcvLineChart },
    data() {
      return {
        networkOneData
      };
    },
    methods: {
      onTimelineClick(date, event) {
        console.log('timeline clicked');
        console.log(date);
        console.log(event);
      },
      onLegendClick(index, event) {
        console.log('legend clicked');
        console.log(index);
        console.log(event);
      }
    }
  };
</script>

<template>
  <div class="qa-line-chart-basic">
    <AcvLineChart
      :data="networkOneData"
      tooltip-time-format="dd MMM yyy, HH:MM"
      @timeline-click="onTimelineClick"
      @legend-click="onLegendClick"
    />
  </div>
</template>
