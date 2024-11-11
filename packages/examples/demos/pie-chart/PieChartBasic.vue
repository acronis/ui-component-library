<script>
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';

  export default {
    components: { AcvPieChart },
    data() {
      return {
        data: {
          dataType: 'size',
          name: 'Total space',
          labels: ['Backups', 'Other', 'Free'],
          sets: [
            {
              points: [824, 412, 67]
            }
          ]
        }
      };
    },
    methods: {
      onSliceClick(index, event) {
        console.log('slice clicked');
        console.log(index);
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
  <div class="qa-pie-chart-basic">
    <AcvPieChart
      :data="data"
      @slice-click="onSliceClick"
      @legend-click="onLegendClick"
    />
  </div>
</template>

<style scoped>
.custom-summary {
  padding: 10px;
  text-align: center;
}
</style>
