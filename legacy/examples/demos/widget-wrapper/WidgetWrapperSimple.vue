<script setup>
// import { computed } from 'vue';
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';
  import AcvStackedAreaChart from '@/components/stacked-area-chart/stackedAreaChart.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';

  const title = 'Storage';
  const data = {
    dataType: 'size',
    name: 'Total space',
    labels: ['Backups', 'Other', 'Free'],
    sets: [{
      points: [824, 412, 67]
    }]
  };
  const dataTwo = {
    dataType: 'size',
    name: 'Total space',
    labels: ['Backups', 'Other', 'Free'],
    sets: [{
      points: [412, 67]
    }]
  };
  const dataThree = {
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
  };
// const sortCriterion = 'Title (Ascending A - Z)';
// const sortCriteria = ['Title (Ascending A - Z)', 'Title (Descending A - Z)'];
// const widgetsData = [
//   {
//     type: 'pie',
//     title: 'CPU temperature',
//     subtitle: 'Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz',
//     data: {
//       dataType: 'size',
//       name: 'Total space',
//       labels: ['Backups', 'Other', 'Free'],
//       sets: [{
//         points: [824, 412, 67]
//       }]
//     }
//   },
//   {
//     type: 'line',
//     title: 'Memory usage',
//     data: {
//       series: [
//         {
//           name: 'Critical',
//           points: [40, 55, 76, 80, 14, 45]
//         }
//       ],
//       labels: [
//         new Date('2020-10-01T00:00:00'),
//         new Date('2020-10-01T15:00:00'),
//         new Date('2020-10-01T17:15:00'),
//         new Date('2020-10-02T00:30:00'),
//         new Date('2020-10-02T02:00:00'),
//         new Date('2020-10-02T06:00:00')
//       ]
//     }
//   },
//   {
//     type: 'table',
//     title: 'Installed software',
//     fullWidth: true,
//     data: [{
//       key: {
//         title: 'Cisco AnyConnect Secure Mobility Client',
//         subtitle: 'Version: 4.9.01425 > 4.10.02086',
//         description: 'Cisco Systems, Inc.',
//         tag: {
//           type: 'info',
//           text: 'Updated'
//         }
//       },
//       value: 'Oct 20, 2021 13:45'
//     }, {
//       key: {
//         title: 'Adobe Acrobat Reader DC',
//         subtitle: 'Version: 21.007.20099',
//         description: 'Adobe Systems Incorporated',
//         tag: {
//           type: 'info',
//           text: 'New'
//         }
//       },
//       value: 'Oct 20, 2021 13:45'
//     }, {
//       key: {
//         title: 'Cisco AnyConnect Secure Mobility Client',
//         subtitle: 'Version: 4.10.02086',
//         description: 'Cisco Systems, Inc.',
//         tag: {
//           type: 'info',
//           text: 'Deleted'
//         }
//       },
//       value: 'Oct 20, 2021 13:45'
//     }]
//   },
//   {
//     type: 'table',
//     title: 'Hardware changes',
//     fullWidth: true,
//     data: [{
//       key: {
//         title: 'Cisco AnyConnect Secure Mobility Client',
//         subtitle: 'Version: 4.9.01425 > 4.10.02086',
//         description: 'Cisco Systems, Inc.',
//         tag: {
//           type: 'info',
//           text: 'Updated'
//         }
//       },
//       value: 'Oct 20, 2021 13:45'
//     }, {
//       key: {
//         title: 'Adobe Acrobat Reader DC',
//         subtitle: 'Version: 21.007.20099',
//         description: 'Adobe Systems Incorporated',
//         tag: {
//           type: 'info',
//           text: 'New'
//         }
//       },
//       value: 'Oct 20, 2021 13:45'
//     }, {
//       key: {
//         title: 'Cisco AnyConnect Secure Mobility Client',
//         subtitle: 'Version: 4.10.02086',
//         description: 'Cisco Systems, Inc.',
//         tag: {
//           type: 'info',
//           text: 'Deleted'
//         }
//       },
//       value: 'Oct 20, 2021 13:45'
//     }]
//   },
//   {
//     type: 'list',
//     title: 'Firewall',
//     data: [{
//       key: 'Firewall is enabled',
//       hasBullet: true,
//       bulletType: 'success'
//     }]
//   },
//   {
//     type: 'list',
//     title: 'Failed logins',
//     data: [{
//       key: 'Failed login attempts',
//       value: 15,
//       hasBullet: false,
//     }]
//   },
//   {
//     type: 'list',
//     title: 'Windows event log',
//     data: [{
//       key: 'Any',
//       value: '22 events',
//       hasBullet: false,
//     }]
//   }
// ];
// const widgetsDataSorted = computed(() => {
//   return data.widgetsData.sort((a, b) => {
//     switch (this.sortCriterion) {
//       case 'Title (Ascending A - Z)':
//         return a.title.localeCompare(b.title);
//       case 'Title (Descending A - Z)':
//         return -1 * a.title.localeCompare(b.title);
//       default:
//         return 0;
//     }
//   });
// });
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default"
      span="12"
    >
      <AcvWidgetWrapper :title="title">
        <AcvPieChart :data="data" />
      </AcvWidgetWrapper>
    </Preview>
    <Preview
      name="Empty"
      span="12"
    >
      <AcvWidgetWrapper :title="title" />
    </Preview>
    <Preview
      name="Change layout"
      span="12"
    >
      <AcvWidgetWrapper
        class="widget-three"
        :title="title"
      >
        <AcvPieChart :data="data" />
      </AcvWidgetWrapper>
    </Preview>
    <Preview
      name="Missing or invalid data"
      span="12"
    >
      <AcvWidgetWrapper :title="title">
        <AcvPieChart :data="dataTwo" />
      </AcvWidgetWrapper>
    </Preview>
    <Preview
      name="Multiple widgets"
      span="24"
    >
      <AcvWidgetWrapper :title="title">
        <AcvStackedAreaChart
          :data="dataThree"
          :legend="false"
          width="280px"
          height="200px"
        />
        <AcvPieChart :data="data" />
      </AcvWidgetWrapper>
    </Preview>
  </PreviewGroup>
</template>

<style scoped>
.widget-three {
  .acv-pie-chart {
    width: 340px;
    height: 200px;
  }

  .acv-pie-chart__legend {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .acv-pie-chart__drawing {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

.widget-table {
  .acv-table {
    width: 600px;
  }
}

.dynamic-positioning {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  width: 656px;
  background-color: var(--acv-color-primary);
  justify-content: center;
}

.dynamic-positioning > * {
  flex: 1 0 calc(50% - 30px);
  min-width: initial;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.indicator-success {
  background-color: var(--acv-color-success);
}

.table-row {
  border-top: 1px solid var(--acv-color-link-primary);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.list-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 1px solid var(--acv-color-link-primary);
  height: 100%;
}

.custom-widget-wrapper {
  background-color: var(--acv-color-black);

  > .acv-widget-wrapper__view {
    flex-direction: column;
    align-items: start;
  }
}
</style>
