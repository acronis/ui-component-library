<script>
  import AcvButton from '@/components/button/button.vue';
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';

  export default {
    components: { AcvButton, AcvPieChart },
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
        },
        dataTwo: {
          dataType: 'size',
          name: 'Total space',
          labels: ['Backups', 'Other', 'Free'],
          sets: [
            {
              points: [824, 412, 67]
            }
          ]
        },
        origPoints: [824, 412, 67],
        alterPoints: [1224, 562, 1326],
        isChangedData: false
      };
    },
    methods: {
      handleChangeData() {
        if (!this.isChangedData) {
          this.dataTwo.sets[0].points = this.alterPoints;
        }
        else {
          this.dataTwo.sets[0].points = this.origPoints;
        }
        console.log(this.dataTwo.sets[0].points);
        this.isChangedData = !this.isChangedData;
      },
      onClose() {
        console.log('Alert is closed');
      }
    }
  };
</script>

<template>
  <div class="qa-pie-chart-basic">
    <AcvPieChart :data="data" />
    <AcvButton @click="handleChangeData">
      Change data
    </AcvButton>
  </div>
</template>
