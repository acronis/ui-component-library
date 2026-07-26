<script>
  import AcvButton from '@/components/button/button.vue';
  import AcvStackedAreaChart from '@/components/stacked-area-chart/stackedAreaChart.vue';

  export default {
    components: {
      AcvStackedAreaChart,
      AcvButton
    },
    data: () => ({
      data: {
        dataType: 'size',
        name: 'Current usage',
        sets: [
          {
            name: 'Storage One',
            points: [10, 105.4543, 110, 110, 120, 180]
          },
          {
            name: 'Storage Two',
            points: [300, 300, 320, 130, 332, 0]
          },
          {
            name: 'Storage Three',
            points: [200, 220, 228, 228, 228, 0]
          }
        ],
        labels: ['01 Oct', '02 Oct', '03 Oct', '04 Oct', '05 Oct', '06 Oct']
      },
      dataTwo: {
        dataType: 'size',
        name: 'Current usage',
        sets: [
          {
            name: 'Storage One',
            points: [10, 105, 110, 110, 120, 180]
          },
          {
            name: 'Storage Two',
            points: [300, 300, 320, 130, 332, 0]
          },
          {
            name: 'Storage Three',
            points: [200, 220, 228, 228, 228, 0]
          }
        ],
        labels: ['01 Oct', '02 Oct', '03 Oct', '04 Oct', '05 Oct', '06 Oct']
      },
      isChangedData: false,
      alterPoints: [
        {
          name: 'Storage One',
          points: [220, 60, 40, 300, 420, 280]
        },
        {
          name: 'Storage Two',
          points: [120, 80, 620, 440, 200, 120]
        },
        {
          name: 'Storage Three',
          points: [200, 220, 228, 228, 228, 0]
        }
      ],
      origPoints: [
        {
          name: 'Storage One',
          points: [10, 105, 110, 110, 120, 180]
        },
        {
          name: 'Storage Two',
          points: [300, 300, 320, 130, 332, 0]
        },
        {
          name: 'Storage Three',
          points: [200, 220, 228, 228, 228, 0]
        }
      ]
    }),
    methods: {
      onLegendClick(seriesIndex, event) {
        console.log('legend clicked');
        console.log(seriesIndex);
        console.log(event);
      },
      onPointClick(seriesIndices, index, event) {
        console.log('point clicked');
        console.log(seriesIndices);
        console.log(index);
        console.log(event);
      },
      handleChangeData() {
        if (!this.isChangedData) {
          this.dataTwo.series = this.alterPoints;
        }
        else {
          this.dataTwo.series = this.origPoints;
        }
        this.isChangedData = !this.isChangedData;
      }
    }
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default"
      span="24"
    >
      <AcvStackedAreaChart
        :data="data"
        @point-click="onPointClick"
        @legend-click="onLegendClick"
      />
    </Preview>
    <Preview
      name="Change data"
      span="24"
    >
      <AcvStackedAreaChart
        :data="dataTwo"
        @point-click="onPointClick"
        @legend-click="onLegendClick"
      />
      <div class="mt-24">
        <AcvButton @click="handleChangeData">
          Change data
        </AcvButton>
      </div>
    </Preview>
    <Preview
      name="Acronis branding colors"
      span="24"
    >
      <AcvStackedAreaChart
        :data="data"
        @point-click="onPointClick"
        @legend-click="onLegendClick"
      />
    </Preview>
  </PreviewGroup>
</template>
