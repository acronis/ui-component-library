<script>
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import AcvDropdownItem from '@/components/dropdown/dropdownItem.vue';
  import AcvDropdownMenu from '@/components/dropdown/dropdownMenu.vue';
  import AcvLineChart from '@/components/line-chart/lineChart.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';
  import anomaliesData from '../../__mocks__/data.mock.anomalies.json';

  export default {
    components: {
      AcvWidgetWrapper,
      AcvButton,
      AcvDropdown,
      AcvDropdownMenu,
      AcvDropdownItem,
      AcvLineChart
    },
    data() {
      return {
        selectedTimeUnit: 'day',
        timeUnitOptions: [
          {
            value: 'hour',
            label: 'per hour'
          },
          {
            value: 'day',
            label: 'per day'
          },
          {
            value: 'month',
            label: 'per month'
          },
          {
            value: 'year',
            label: 'per year'
          }
        ],
        data: {
          data: [
            {
              name: 'CPU',
              points: anomaliesData.points.map(point => ({
                ...point,
                x: new Date(point.x)
              }))
            }
          ]
        }
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
      handleDropdownChange(_, instance) {
        const index = instance.$parent.$children.findIndex(
          $children => $children._uid === instance._uid
        );
        this.selectedTimeUnit = this.timeUnitOptions[index].value;
      },
      onClose() {
        console.log('Alert is closed');
      }
    }
  };
</script>

<template>
  <AcvWidgetWrapper
    title="CPU historical data"
    :style="{ width: '700px' }"
  >
    <template #header-aside>
      <AcvDropdown
        placement="bottom-start"
        @command="handleDropdownChange"
      >
        <AcvButton
          type="ghost"
          right-icon
          icon="i-chevron-down--16"
        >
          {{ selectedTimeUnitLabel }}
        </AcvButton>
        <template #dropdown>
          <AcvDropdownMenu>
            <AcvDropdownItem
              v-for="option in timeUnitOptions"
              :key="option.value"
            >
              {{ option.label }}
            </AcvDropdownItem>
          </AcvDropdownMenu>
        </template>
      </AcvDropdown>
    </template>
    <AcvLineChart
      :data="data"
      :time-unit="selectedTimeUnit"
      variable-threshold
    />
  </AcvWidgetWrapper>
</template>
