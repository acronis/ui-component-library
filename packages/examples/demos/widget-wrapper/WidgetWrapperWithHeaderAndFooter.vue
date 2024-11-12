<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvLink from '@/components/link/link.vue';
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';
  import AcvStackedAreaChart from '@/components/stacked-area-chart/stackedAreaChart.vue';
  import AcvTable from '@/components/table/table.vue';
  import AcvTableColumn from '@/components/table-column/tableColumn.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';
  import tableData from '../../__mocks__/data.mock.5.json';

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
</script>

<template>
  <PreviewGroup>
    <Preview name="Default">
      <AcvWidgetWrapper
        :title="title"
      >
        <template #header-aside>
          <AcvButton
            type="ghost"
            icon="i-console-log-o--16"
          />
        </template>
        <AcvStackedAreaChart
          :data="dataThree"
          :legend="false"
          width="280px"
          height="200px"
        />
        <template #footer>
          <AcvIcon
            name="exclamation-triangle--16"
            color="fixed-warning"
          />
          <AcvLink class="acv-text acv-text--body-24 ml-8">
            1 alert
          </AcvLink>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </AcvWidgetWrapper>
    </Preview>
    <Preview name="Wide">
      <AcvWidgetWrapper
        class="widget-three"
        :title="title"
      >
        <template #header-aside>
          <AcvButton
            type="ghost"
            icon="i-console-log-o--16"
          />
        </template>
        <AcvStackedAreaChart
          :data="dataThree"
          :legend="false"
          width="280px"
          height="200px"
        />
        <AcvPieChart :data="data" />
        <template #footer>
          <AcvIcon
            name="exclamation-triangle--16"
            color="fixed-warning"
          />
          <AcvLink class="acv-text acv-text--body-24 ml-8">
            1 alert
          </AcvLink>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </AcvWidgetWrapper>
    </Preview>
    <Preview name="With table widget">
      <AcvWidgetWrapper
        class="widget-table"
        no-padding
        min-height="0px"
      >
        <AcvTable
          row-key="id"
          :data="tableData"
          size="compact"
        >
          <AcvTableColumn
            prop="date"
            label="Date"
            width="180"
          />
          <AcvTableColumn
            prop="name"
            label="Name"
            show-overflow-tooltip
            width="180"
          />
          <AcvTableColumn
            prop="address"
            label="Address"
            show-overflow-tooltip
          />
        </AcvTable>
        <template #footer>
          <AcvIcon
            name="exclamation-triangle--16"
            color="fixed-warning"
          />
          <AcvLink class="acv-text acv-text--body-24 ml-8">
            1 alert
          </AcvLink>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </AcvWidgetWrapper>
    </Preview>
    <Preview name="Header and footer with long text strings">
      <AcvWidgetWrapper
        :title="longHeaderText"
      >
        <template #header-aside>
          <AcvButton
            type="ghost"
            icon="i-console-log-o--16"
          />
        </template>
        <AcvTable
          row-key="id"
          :data="tableData"
          size="compact"
        >
          <AcvTableColumn
            prop="date"
            label="Date"
            width="180"
          />
          <AcvTableColumn
            prop="name"
            label="Name"
            show-overflow-tooltip
            width="180"
          />
          <AcvTableColumn
            prop="address"
            label="Address"
            show-overflow-tooltip
          />
        </AcvTable>
        <template #footer>
          <AcvLink class="acv-text acv-text--body-24 ml-8">
            {{ longFooterText }}
          </AcvLink>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </AcvWidgetWrapper>
    </Preview>
    <Preview name="Dynamic positioning">
      <div />
    </Preview>
  </PreviewGroup>
</template>
