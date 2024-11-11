<script>
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvLineChart from '@/components/line-chart/lineChart.vue';
  import AcvOption from '@/components/option/option.vue';
  import AcvPieChart from '@/components/pie-chart/pieChart.vue';
  import AcvSelect from '@/components/select/select.vue';
  import AcvTag from '@/components/tag/tag.vue';
  import AcvWidgetWrapper from '@/components/widget-wrapper/widgetWrapper.vue';

  export default {
    components: {
      AcvSelect,
      AcvOption,
      AcvIcon,
      AcvTag,
      AcvLineChart,
      AcvPieChart,
      AcvWidgetWrapper
    },
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
        },
        widgetsData: [
          {
            type: 'pie',
            title: 'CPU temperature',
            subtitle: 'Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz',
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
          },
          {
            type: 'line',
            title: 'Memory usage',
            data: {
              series: [
                {
                  name: 'Critical',
                  points: [40, 55, 76, 80, 14, 45]
                }
              ],
              labels: [
                new Date('2020-10-01T00:00:00'),
                new Date('2020-10-01T15:00:00'),
                new Date('2020-10-01T17:15:00'),
                new Date('2020-10-02T00:30:00'),
                new Date('2020-10-02T02:00:00'),
                new Date('2020-10-02T06:00:00')
              ]
            }
          },
          {
            type: 'table',
            title: 'Installed software',
            fullWidth: true,
            data: [
              {
                key: {
                  title: 'Cisco AnyConnect Secure Mobility Client',
                  subtitle: 'Version: 4.9.01425 > 4.10.02086',
                  description: 'Cisco Systems, Inc.',
                  tag: {
                    type: 'info',
                    text: 'Updated'
                  }
                },
                value: 'Oct 20, 2021 13:45'
              },
              {
                key: {
                  title: 'Adobe Acrobat Reader DC',
                  subtitle: 'Version: 21.007.20099',
                  description: 'Adobe Systems Incorporated',
                  tag: {
                    type: 'info',
                    text: 'New'
                  }
                },
                value: 'Oct 20, 2021 13:45'
              },
              {
                key: {
                  title: 'Cisco AnyConnect Secure Mobility Client',
                  subtitle: 'Version: 4.10.02086',
                  description: 'Cisco Systems, Inc.',
                  tag: {
                    type: 'info',
                    text: 'Deleted'
                  }
                },
                value: 'Oct 20, 2021 13:45'
              }
            ]
          },
          {
            type: 'table',
            title: 'Hardware changes',
            fullWidth: true,
            data: [
              {
                key: {
                  title: 'Cisco AnyConnect Secure Mobility Client',
                  subtitle: 'Version: 4.9.01425 > 4.10.02086',
                  description: 'Cisco Systems, Inc.',
                  tag: {
                    type: 'info',
                    text: 'Updated'
                  }
                },
                value: 'Oct 20, 2021 13:45'
              },
              {
                key: {
                  title: 'Adobe Acrobat Reader DC',
                  subtitle: 'Version: 21.007.20099',
                  description: 'Adobe Systems Incorporated',
                  tag: {
                    type: 'info',
                    text: 'New'
                  }
                },
                value: 'Oct 20, 2021 13:45'
              },
              {
                key: {
                  title: 'Cisco AnyConnect Secure Mobility Client',
                  subtitle: 'Version: 4.10.02086',
                  description: 'Cisco Systems, Inc.',
                  tag: {
                    type: 'info',
                    text: 'Deleted'
                  }
                },
                value: 'Oct 20, 2021 13:45'
              }
            ]
          },
          {
            type: 'list',
            title: 'Firewall',
            data: [
              {
                key: 'Firewall is enabled',
                hasBullet: true,
                bulletType: 'success'
              }
            ]
          },
          {
            type: 'list',
            title: 'Failed logins',
            data: [
              {
                key: 'Failed login attempts',
                value: 15,
                hasBullet: false
              }
            ]
          },
          {
            type: 'list',
            title: 'Windows event log',
            data: [
              {
                key: 'Any',
                value: '22 events',
                hasBullet: false
              }
            ]
          }
        ]
      };
    },
    computed: {
      widgetsDataSorted() {
        return [...this.widgetsData].sort((a, b) => {
          switch (this.sortCriterion) {
            case 'Title (Ascending A - Z)':
              return a.title.localeCompare(b.title);
            case 'Title (Descending A - Z)':
              return -1 * a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });
      }
    }
  };
</script>

<template>
  <AcvSelect v-model="sortCriterion">
    <AcvOption
      v-for="criterion in sortCriteria"
      :key="criterion"
      :label="criterion"
      :value="criterion"
    />
  </AcvSelect>

  <div class="dynamic-positioning pa-24 mt-24">
    <AcvWidgetWrapper
      v-for="(widget, index) in widgetsDataSorted"
      :key="index"
      class="custom-widget-wrapper"
      no-padding
      :title="widget.title"
      :subtitle="widget.subtitle"
      min-height="0px"
      :style="[
        { flex: widget.fullWidth ? '1 1 calc(100%)' : '1 1 calc(50% - 32px)' },
      ]"
    >
      <template v-if="widget.type === 'pie'">
        <div class="chart-wrapper px-24 py-24">
          <AcvPieChart
            :data="widget.data"
            :legend="false"
            width="144px"
          />
        </div>
      </template>
      <template v-if="widget.type === 'line'">
        <div class="chart-wrapper px-24 py-8">
          <AcvLineChart
            :data="widget.data"
            :legend="false"
          />
        </div>
      </template>
      <template v-if="widget.type === 'list'">
        <div class="list-wrapper px-24 py-16">
          <div
            v-for="d in widget.data"
            :key="d.key"
          >
            <span
              v-if="d.hasBullet"
              class="indicator indicator-success mr-8"
            />
            <span class="acv-text acv-text--body-24">{{ d.key }}</span>
          </div>
          <div
            v-for="d in widget.data"
            :key="d.key"
          >
            <span class="acv-text acv-text--body-24">{{ d.value }}</span>
          </div>
        </div>
      </template>
      <template v-if="widget.type === 'table'">
        <div
          v-for="d in widget.data"
          :key="d.key.title"
          class="table-row px-24 py-8"
        >
          <div>
            <div class="acv-text acv-text--strong">
              {{ d.key.title }}
              <AcvTag
                v-if="d.key.tag"
                class="ml-8"
                small
                :type="d.key.tag.type"
              >
                {{ d.key.tag.text }}
              </AcvTag>
            </div>
            <div class="acv-text acv-text--body-24">
              {{ d.key.subtitle }}
            </div>
            <div class="acv-text acv-text--caption">
              {{ d.key.description }}
            </div>
          </div>
          <div>
            <div class="acv-text acv-text--body-24">
              {{ d.value }}
            </div>
          </div>
        </div>
      </template>
      <template #footer-aside>
        <AcvIcon
          name="exclamation-triangle--16"
          color="fixed-warning"
        />
        <span class="acv-text acv-text--body-24 ml-8">1 Alert</span>
      </template>
      <template #footer>
        <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
      </template>
    </AcvWidgetWrapper>
  </div>
</template>
