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
        pureDataChart: {
          dataType: 'size',
          name: 'Total',
          labels: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'],
          sets: [
            {
              points: [10, 20, 30, 40, 50, 60]
            }
          ]
        },
        pureDataChartP(index) {
          return {
            dataType: 'size',
            name: 'Total',
            labels: this.pureDataChart.labels.slice(0, index),
            sets: [
              {
                points: this.pureDataChart.sets[0].points.slice(0, index)
              }
            ]
          };
        }
      };
    },
    methods: {}
  };
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <div
      v-for="index in 6"
      :key="`data-${index}`"
      class="mt-8"
    >
      <AcvWidgetWrapper :title="`Data chart ${index}`">
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
        <AcvPieChart :data="pureDataChartP(index)" />
        <template #footer>
          <span class="acv-text acv-text--caption">
            <span class="ml-8">Label:</span>
            <span><b>Value</b></span>
          </span>
        </template>
      </AcvWidgetWrapper>
    </div>
  </div>
</template>
