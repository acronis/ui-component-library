<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import AcvDropdownItem from '@/components/dropdown/dropdownItem.vue';
  import AcvDropdownMenu from '@/components/dropdown/dropdownMenu.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';

  const dataGPUTemperature = {
    dataType: 'temperature',
    isPercentage: true,
    maximumPoint: 110,
    sets: [
      {
        points: [96],
        colors: ['chart-danger']
      }
    ],
    name: 'GPU temperature'
  };
</script>

<template>
  <AcvWidgetWrapper
    title="GPU temperature"
    subtitle="Intel(R) UHD Graphics 620"
  >
    <template #header-aside>
      <AcvDropdown placement="bottom-end">
        <AcvButton
          type="ghost"
          size="small"
        >
          <AcvIcon
            name="ellipsis-h--16"
            color="fixed-link"
          />
        </AcvButton>
        <template #dropdown>
          <AcvDropdownMenu :max-height="250">
            <AcvDropdownItem>First action</AcvDropdownItem>
            <AcvDropdownItem>Second action</AcvDropdownItem>
          </AcvDropdownMenu>
        </template>
      </AcvDropdown>
    </template>
    <AcvPieChart
      :data="dataGPUTemperature"
      :legend="false"
    />
    <template #footer-aside>
      <AcvButton
        icon="warning--16"
        type="ghost"
      >
        2 Alerts
      </AcvButton>
    </template>
    <template #footer>
      <div class="acv-text acv-text--caption">
        <div>Last check:</div>
        <div><b>2 minutes ago</b></div>
      </div>
    </template>
  </AcvWidgetWrapper>
</template>

<style scoped>
.chart-wrapper {
  background-color: hsl(0deg 0% 100% / 0.05);
}
</style>
