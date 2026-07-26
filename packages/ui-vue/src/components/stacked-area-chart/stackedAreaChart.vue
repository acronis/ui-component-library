<script>
  import WidgetChart from '@/composables/widget.chart';
  import { cleanData, isValidData } from '@/utils/widget';
  import { isBrowser } from '@antfu/utils';
  import Chart from 'chart.js/auto';
  import WidgetEmpty from '../widget-wrapper/widgetEmpty.vue';
  import WidgetInvalid from '../widget-wrapper/widgetInvalid.vue';
  import WidgetLoading from '../widget-wrapper/widgetLoading.vue';

  export default {
    name: 'AcvStackedAreaChart',
    components: {
      WidgetInvalid,
      WidgetLoading,
      WidgetEmpty
    },
    mixins: [WidgetChart],
    props: {
      data: {
        type: Object,
        default: () => {
          return {};
        }
      },
      height: {
        type: String,
        default: '200px'
      },
      legend: {
        type: Boolean,
        default: true
      },
      precision: {
        type: Number,
        default: 0
      },
      width: {
        type: String,
        default: '400px'
      }
    },
    data() {
      this.chart = null;
      return {
        tooltip: false,
        hoveredDIndex: [],
        hoveredIndex: -1,
        totalValue: null,
        definedOptions: {
          maintainAspectRatio: false,
          scales: {
            y: {
              stacked: true,
              grid: {
                drawTicks: false
              },
              ticks: {
                padding: 10,
                maxTicksLimit: 6
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
              }
            }
          },
          legend: {
            display: true
          },
          onClick: (e, items) => {
            this.onCanvasClick(e, items);
          },
          onHover: (e, item) => {
            this.onCanvasHover(e, item);
          },
          hover: {
            mode: 'point',
            intersect: false
          },
          plugins: {
            tooltips: {
              enabled: false
            }
          }
        }
      };
    },
    computed: {
      dataName() {
        return this.data?.name || '';
      }
    },
    watch: {
      data: {
        deep: true,
        handler() {
          this.renderAll();
        }
      }
    },
    created() {
      this.chartType = 'stacked-area';
      this.updateChartColors();
      // this.$root.$on('app.color.changed', () => {
      //   this.updateChartColors();
      //   this.generateData();
      // });
    },
    methods: {
      generateData() {
        this.currentState = 'LOADING';
        this.$nextTick(() => {
          if (!this.data || !this.data.labels || !this.data.sets) {
            this.currentState = 'DATA_MISSING';
            return;
          }
          let isValid = true;
          const dataSeriesArr = [];
          const n = this.data.labels.length;
          this.data.sets.forEach((a) => {
            if (a.points && a.points.length === n && isValidData(a.points, 'single')) {
              dataSeriesArr.push({
                label: a.name,
                data: cleanData(a.points),
                tension: 0.1,
                fill: true,
                borderWidth: 1,
                pointHitRadius: 4,
                pointHoverRadius: 0,
                pointBorderWidth: 2,
                pointRadius: 0
              });
            }
            else {
              isValid = false;
            }
          });
          if (isValid) {
            this.parsedData = {
              labels: this.data.labels,
              datasets: dataSeriesArr
            };
            this.currentState = 'DATA_READY';
          }
          else {
            this.currentState = 'DATA_FAILED';
          }
        });
      },
      updateChartColors() {
        if (!isBrowser)
          return;
        this.definedOptions.scales.y.grid.color = window.getComputedStyle(document.body).getPropertyValue('--av-brand-accent');
        this.definedOptions.scales.y.ticks.fontColor = window.getComputedStyle(document.body).getPropertyValue('--av-fixed-primary');
        this.definedOptions.scales.x.ticks.fontColor = window.getComputedStyle(document.body).getPropertyValue('--av-fixed-primary');
      },
      onCanvasClick(e, items) {
        if (items.length) {
          this.$emit('pointClick', items.map(item => item._datasetIndex), items[0]._index, e);
        }
      },
      onCanvasHover(e, item) {
        if (e?.target) {
          e.target.style.cursor = 'default';
        }
        if (item.length) {
          if (e?.target) {
            e.target.style.cursor = 'pointer';
          }
        }
      },
      onLegendHover(index) {
        this.$el.querySelectorAll('.acv-stacked-area-chart__legend__item').forEach((e) => {
          e.style.opacity = 1.0;
        });
        this.chart.data.datasets.forEach((e) => {
          e.hidden = false;
        });
        if (index !== -1) {
          this.$el.querySelectorAll('.acv-stacked-area-chart__legend__item').forEach((e, i) => {
            if (i !== index) {
              e.style.opacity = 0.2;
            }
          });
          this.chart.data.datasets.forEach((e, i) => {
            if (i !== index) {
              e.hidden = true;
            }
          });
        }
        this.chart.update(0);
      },
      calculateTotal() {
        let total = 0;
        this.data.sets.forEach((a) => {
          total += a.points[a.points.length - 1];
        });
        this.totalValue = total;
      },
      renderChart() {
        for (let i = 0; i < this.parsedData.datasets.length; i++) {
          this.parsedData.datasets[i].backgroundColor = this.getColors();
        }
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart(
          this.$refs.chartCanvas.getContext('2d'),
          {
            type: 'line',
            data: this.parsedData,
            options: this.definedOptions
          }
        );
      }
    }
  };
</script>

<template>
  <div
    class="acv-stacked-area-chart"
  >
    <WidgetLoading v-if="isLoading" />
    <WidgetEmpty v-else-if="isEmpty" />
    <WidgetInvalid v-else-if="isFailed" />
    <template v-else>
      <div
        class="acv-stacked-area-chart__drawing"
        :style="{ width, height }"
      >
        <canvas ref="chartCanvas" />
      </div>
      <div
        class="acv-stacked-area-chart__summary acv-text"
      >
        <span class="acv-text--body-24 acv-stacked-area-chart__subtitle">{{ dataName }}</span>
        <span class="acv-text--display-regular acv-stacked-area-chart__title">
          {{ totalValue }}
        </span>
      </div>
      <div
        v-if="legend"
        class="acv-stacked-area-chart__legend px-8"
      >
        <template v-if="$slots.legend">
          <slot name="legend" />
        </template>
      </div>
    </template>
  </div>
</template>
