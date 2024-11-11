<script>
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import AcvDropdownItem from '@/components/dropdown/dropdownItem.vue';
  import AcvDropdownMenu from '@/components/dropdown/dropdownMenu.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';

  export default {
    components: {
      AcvDropdownItem,
      AcvDropdownMenu,
      AcvIcon,
      AcvDropdown,
      AcvButton,
      AcvPieChart,
      AcvWidgetWrapper
    },
    data() {
      return {
        dataStatusChartP(index) {
          return {
            name: 'Total',
            labels: this.dataStatusChart.labels.slice(0, index),
            sets: [
              {
                points: this.dataStatusChart.sets[0].points.slice(0, index)
              }
            ]
          };
        },
        dataStatusChart: {
          name: 'Total',
          labels: ['Success', 'Warning', 'Critical', 'Danger'],
          sets: [
            {
              points: [50, 50, 75, 25],
              colors: [
                'chart-success',
                'chart-warning',
                'chart-critical',
                'chart-danger'
              ]
            }
          ]
        }
      };
    },
    methods: {}
  };
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <div
      v-for="index in 4"
      :key="`status-${index}`"
      class="mt-8"
    >
      <AcvWidgetWrapper title="Status chart">
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
        <AcvPieChart :data="dataStatusChartP(index)" />
        <template #footer-aside>
          <AcvButton type="ghost">
            Scan report
          </AcvButton>
        </template>
        <template #footer>
          <div class="acv-text acv-text--caption">
            <div>Last scan:</div>
            <div><b>26 Jun 2020, 15:45:30</b></div>
          </div>
        </template>
      </AcvWidgetWrapper>
    </div>
  </div>
</template>
