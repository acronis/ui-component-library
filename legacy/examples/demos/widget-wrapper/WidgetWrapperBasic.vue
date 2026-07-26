<script>
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';

  export default {
    components: { AcvPieChart, AcvWidgetWrapper },
    data() {
      return {
        title: 'Storage',
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
    }
  };
</script>

<template>
  <AcvWidgetWrapper :title="title">
    <AcvPieChart :data="data" />
  </AcvWidgetWrapper>
</template>
