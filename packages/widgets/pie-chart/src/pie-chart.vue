<template>
  <div class="el-pie-chart">
    <WidgetLoading v-if="isLoading" />
    <WidgetEmpty v-else-if="isEmpty" />
    <WidgetInvalid v-else-if="isFailed" />
    <template v-else>
      <div
        class="el-pie-chart__drawing"
        :style="{ width: width }"
      >
        <canvas ref="chartCanvas" />
        <div
          v-if="summary"
          ref="summary"
          class="el-pie-chart__summary el-text"
        >
          <slot
            name="summary"
            :chart="this"
          >
            <div
              v-if="totalValue"
              :title="displayValue()"
              class="el-pie-chart__title el-text--body-24"
            >
              {{ appendUnit(totalValue, parsedDataType, precision) }}
            </div>
            <div
              v-if="dataName"
              :title="displayName()"
              class="el-pie-chart__subtitle el-text--caption"
            >
              {{ dataName }}
            </div>
          </slot>
        </div>
      </div>
      <div
        v-if="legend"
        ref="legend"
        class="el-pie-chart__legend ml-16"
      />
    </template>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import WidgetChart from 'packages/widgets/mixins/widget.chart';
import {
  cleanData,
  isValidData,
  getPercentageData
} from '@/utils/widget';
import WidgetInvalid from 'packages/widgets/widget-wrapper/src/widget-invalid.vue';
import WidgetLoading from 'packages/widgets/widget-wrapper/src/widget-loading.vue';
import WidgetEmpty from 'packages/widgets/widget-wrapper/src/widget-empty.vue';

export default {
  name: 'ElPieChart',
  components: {
    WidgetInvalid,
    WidgetLoading,
    WidgetEmpty
  },
  mixins: [WidgetChart],
  props: {
    data: {
      type: Object,
      default: () => null
    },
    legend: {
      type: Boolean,
      default: true
    },
    precision: {
      type: Number,
      default: 0
    },
    summary: {
      type: Boolean,
      default: true
    }
  },
  emits: ['legend-click', 'slice-click'],
  data() {
    this.chart = null;
    return {
      tooltip: false,
      width: '120px',
      isFirstUpdate: true,
      hoveredIndex: -1,
      totalValue: null,
      definedOptions: {
        devicePixelRatio: 5,
        plugins: {
          htmlLegend: {
            containerID: 'el-pie-chart__legend'
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        elements: {
          arc: {
            borderColor: getComputedStyle(document.body).getPropertyValue(
              '--av-inversed-primary'
            ),
            borderWidth: 0,
            hoverBorderWidth: 0
          }
        },
        cutout: 48,
        onClick: (e, a) => {
          this.onCanvasClick(e, a);
        },
        onHover: (e, item) => {
          this.onCanvasHover(e, item);
        }
      }
    };
  },
  computed: {
    parsedData() {
      if (!this.data) {
        return null;
      }

      if (this.data.isPercentage) {
        if (
          !this.data.sets
          || this.data.sets[0].points.length !== 1
          || !this.data.maximumPoint
          || !isValidData(this.data.sets[0].points, 'single')
        ) {
          return null;
        }
        return {
          labels: [''],
          datasets: [
            {
              label: this.dataName,
              data: cleanData(
                getPercentageData(
                  this.data.sets[0].points,
                  this.data.maximumPoint
                )
              )
            }
          ]
        };
      }

      if (
        !this.data.labels
        || !this.data.sets[0].points
        || this.data.sets[0].points.length !== this.data.labels.length
        || !isValidData(this.data.sets[0].points, 'single')
      ) {
        return null;
      }

      return {
        labels: this.data.labels,
        datasets: [
          {
            label: this.dataName,
            data: cleanData(this.data.sets[0].points)
          }
        ]
      };
    },
    dataName() {
      if (this.data?.isPercentage) {
        return '';
      }

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
    eventBus.$on('app.color.changed', () => {
      this.definedOptions.elements.arc.borderColor = getComputedStyle(
        document.body
      ).getPropertyValue('--av-inversed-primary');
      this.renderAll();
    });
  },
  methods: {
    generateData() {
      if (!this.data) {
        this.currentState = 'DATA_MISSING';
        return null;
      }

      if (this.data.isPercentage) {
        if (
          !this.data.sets[0].points
          || this.data.sets[0].points.length !== 1
          || !this.data.maximumPoint
          || !isValidData(this.data.sets[0].points, 'single')
        ) {
          this.currentState = 'DATA_MISSING';
          return null;
        }
        this.currentState = 'DATA_READY';
        return {
          labels: [''],
          datasets: [
            {
              label: this.dataName,
              data: cleanData(
                getPercentageData(
                  this.data.sets[0].points,
                  this.data.maximumPoint
                )
              )
            }
          ]
        };
      }

      if (
        !this.data.labels
        || !this.data.sets[0].points
        || this.data.sets[0].points.length !== this.data.labels.length
        || !isValidData(this.data.sets[0].points, 'single')
      ) {
        this.currentState = 'DATA_MISSING';
        return null;
      }
      this.currentState = 'DATA_READY';
      return {
        labels: this.data.labels,
        datasets: [
          {
            label: this.dataName,
            data: cleanData(this.data.sets[0].points)
          }
        ]
      };
    },
    onCanvasHover(e, item) {
      if (item.length) {
        e?.native?.target ? (e.native.target.style.cursor = 'pointer') : null;
      } else {
        e?.native?.target ? (e.native.target.style.cursor = 'default') : null;
      }

      this.$nextTick(() => {
        const colors = this.getColors();
        this.chart
          && this.chart.getDatasetMeta(0).data.forEach((el, i) => {
            if (item.length) {
              if (i !== item[0].index) {
                el.options.backgroundColor = this.fadedColors[i];
              } else {
                el.options.backgroundColor = colors[i];
              }
            } else {
              el.options.backgroundColor = colors[i];
            }
          });
      });

      this.$el
        .querySelectorAll('.el-pie-chart__legend__item')
        .forEach((el, i) => {
          if (item.length) {
            if (i !== item[0].index) {
              el.style.opacity = 0.2;
            } else {
              el.style.opacity = 1.0;
            }
          } else {
            el.style.opacity = 1.0;
          }
        });
    },
    onCanvasClick(e, item) {
      if (item.length) {
        this.$emit('slice-click', item[0].index, e);
      }
    },
    calculateTotal() {
      let total = 0;
      this.data.sets[0].points.forEach((e) => {
        total += e;
      });
      this.totalValue = total;
    },
    renderChart() {
      const colors = this.getColors();
      this.parsedData.datasets[0].backgroundColor = colors;
      this.parsedData.datasets[0].hoverBackgroundColor = colors;

      this.definedOptions.cutout = this.parsedData
        .datasets[0].data.length > 1 ? 48 : 52;

      if (this.isFirstUpdate) {
        this.$nextTick(() => {
          this.chart = new Chart(this.$refs.chartCanvas.getContext('2d'), {
            type: 'doughnut',
            data: this.parsedData,
            options: this.definedOptions,
            plugins: [
              {
                afterUpdate: (chart) => {
                  const b = this.$el.querySelector('.el-pie-chart__legend');
                  if (b) {
                    b.innerHTML = '';
                  }
                  const a = document.createElement('table');
                  chart.data.labels.forEach((e, index) => {
                    const c = document.createElement('tr');
                    c.className = 'el-pie-chart__legend__item el-text el-text--caption';
                    c.setAttribute('tabindex', 0);

                    const d = document.createElement('td');
                    d.className = 'el-pie-chart__legend__label';

                    const bulletContainer = document.createElement('span');
                    bulletContainer.className = 'el-line-chart__legend__bullet';

                    const bullet = document.createElement('span');
                    bullet.style.backgroundColor = chart.data
                      .datasets[0].backgroundColor[index];
                    bullet.className = 'el-line-chart__legend__bullet';

                    bulletContainer.appendChild(bullet);

                    const j = document.createElement('span');
                    j.className = 'el-text el-text--body-24';
                    j.innerHTML = `${e}:`;

                    d.appendChild(bulletContainer);
                    d.appendChild(j);

                    const g = document.createElement('td');
                    const n = document.createElement('span');
                    n.className = 'el-pie-chart__legend__value el-text el-text--strong ml-8';
                    n.innerHTML = this.appendUnit(
                      chart.data.datasets[0].data[index],
                      this.parsedDataType,
                      this.precision
                    );
                    g.append(n);

                    c.appendChild(d);
                    c.appendChild(g);

                    c.onmouseover = () => {
                      this.$el
                        .querySelectorAll('.el-pie-chart__legend__item')
                        .forEach((ele) => {
                          ele.style.opacity = 0.2;
                        });
                      c.style.opacity = 1.0;
                      this.$nextTick(() => {
                        chart
                          && chart.getDatasetMeta(0).data.forEach((el, i) => {
                            el.options.backgroundColor = this.fadedColors[i];
                            if (i === index) {
                              el.options.backgroundColor = colors[i];
                            }
                          });
                        chart.render(0);
                      });
                    };

                    c.onmouseout = () => {
                      this.$el
                        .querySelectorAll('.el-pie-chart__legend__item')
                        .forEach((ele) => {
                          ele.style.opacity = 1.0;
                        });
                      this.$nextTick(() => {
                        chart
                          && chart.getDatasetMeta(0).data.forEach((el, i) => {
                            el.options.backgroundColor = colors[i];
                          });
                        chart.render(0);
                      });
                    };

                    c.onclick = (event) => {
                      this.$emit('legend-click', index, event);
                    };

                    c.addEventListener('keypress', (ev) => {
                      if (ev.key === 'Enter') {
                        ev.preventDefault();
                        this.$emit('legend-click', index, ev);
                      }
                    });

                    a.appendChild(c);
                  });

                  if (b) {
                    b.appendChild(a);
                  }
                }
              }
            ]
          });
        });
        this.isFirstUpdate = false;
      } else if (this.chart) {
        this.chart.data = this.parsedData;
        this.chart.update(0);
      }
    },
    displayValue() {
      return this.appendUnit(
        this.totalValue,
        this.parsedDataType,
        this.precision
      );
    },
    displayName() {
      return this.data?.name || '';
    }
  }
};
</script>
