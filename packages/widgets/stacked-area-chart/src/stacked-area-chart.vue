<template>
  <div
    class="el-stacked-area-chart"
  >
    <WidgetLoading v-if="isLoading" />
    <WidgetEmpty v-else-if="isEmpty" />
    <WidgetInvalid v-else-if="isFailed" />
    <template v-else>
      <div
        class="el-stacked-area-chart__drawing"
        :style="{'width' : width, 'height' : height}"
      >
        <canvas ref="chartCanvas" />
      </div>
      <div
        ref="summary"
        class="el-stacked-area-chart__summary el-text"
      >
        <span class="el-text--body-24 el-stacked-area-chart__subtitle">{{dataName}}</span>
        <span class="el-text--display-regular el-stacked-area-chart__title">
          {{ totalValue }}
        </span>
      </div>
      <div
        v-if="legend"
        ref="legend"
        class="el-stacked-area-chart__legend px-8"
      >
        <template v-if="$slots.legend">
          <slot name="legend" />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import WidgetChart from 'packages/widgets/mixins/widget.chart';
import { cleanData, isValidData } from '@/utils/widget';
import WidgetInvalid from 'packages/widgets/widget-wrapper/src/widget-invalid.vue';
import WidgetLoading from 'packages/widgets/widget-wrapper/src/widget-loading.vue';
import WidgetEmpty from 'packages/widgets/widget-wrapper/src/widget-empty.vue';

export default {
  name: 'ElStackedAreaChart',
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
  watch: {
    data: {
      deep: true,
      handler() {
        this.renderAll();
      }
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
  created() {
    this.chartType = 'stacked-area';
    this.updateChartColors();
    this.$root.$on('app.color.changed', () => {
      this.updateChartColors();
      this.generateData();
    });
  },
  computed: {
    dataName() {
      return this.data?.name || '';
    }
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
          } else {
            isValid = false;
          }
        });
        if (isValid) {
          this.parsedData = {
            labels: this.data.labels,
            datasets: dataSeriesArr
          };
          this.currentState = 'DATA_READY';
        } else {
          this.currentState = 'DATA_FAILED';
        }
      });
    },
    updateChartColors() {
      this.definedOptions.scales.y.grid.color = getComputedStyle(document.body).getPropertyValue('--av-brand-accent');
      this.definedOptions.scales.y.ticks.fontColor = getComputedStyle(document.body).getPropertyValue('--av-fixed-primary');
      this.definedOptions.scales.x.ticks.fontColor = getComputedStyle(document.body).getPropertyValue('--av-fixed-primary');
    },
    onCanvasClick(e, items) {
      if (items.length) {
        this.$emit('point-click', items.map((item) => item._datasetIndex), items[0]._index, e);
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
      this.$el.querySelectorAll('.el-stacked-area-chart__legend__item').forEach((e) => {
        e.style.opacity = 1.0;
      });
      this.chart.data.datasets.forEach((e) => {
        e.hidden = false;
      });
      if (index !== -1) {
        this.$el.querySelectorAll('.el-stacked-area-chart__legend__item').forEach((e, i) => {
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
