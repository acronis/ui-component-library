<script>
  import WidgetChart from '@/composables/widget.chart';
  import { cleanData, getDataMaxY, isValidData } from '@/utils/widget';
  import Chart from 'chart.js/auto';
  import annotationPlugin from 'chartjs-plugin-annotation';
  import { format, parse } from 'date-fns';
  import AcvPopover from '../popover/popover.vue';
  import WidgetEmpty from '../widget-wrapper/widgetEmpty.vue';
  import WidgetInvalid from '../widget-wrapper/widgetInvalid.vue';
  import WidgetLoading from '../widget-wrapper/widgetLoading.vue';
  import 'chartjs-adapter-date-fns';

  Chart.register(annotationPlugin);

  const POINT_RADIUS = 4;
  const POINT_HOVER_RADIUS = 6;

  export default {
    name: 'AcvLineChart',
    components: {
      WidgetInvalid,
      WidgetLoading,
      WidgetEmpty,
      AcvPopover
    },
    mixins: [WidgetChart],
    props: {
      data: {
        type: Object,
        default: () => {
          return null;
        }
      },
      dataPointOnHover: {
        type: Boolean,
        default: false
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
        default: 0,
        validator: value => value >= 0
      },
      stepped: {
        type: Boolean,
        default: false
      },
      timeUnit: {
        type: String,
        default: 'hour',
        validator: value => ['second', 'minute', 'hour', 'day', 'month', 'year'].includes(value)
      },
      tooltip: {
        type: Boolean,
        default: true
      },
      tooltipTimeFormat: {
        type: String,
        default: 'dd MMM yyyy hh:mm:ss'
      },
      variableThreshold: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: ''
      },
      xAxis: {
        type: Boolean,
        default: true
      },
      xGrid: {
        type: Boolean,
        default: true
      },
      yAxis: {
        type: Boolean,
        default: true
      },
      yAxisTicksUpperLimit: {
        type: Number,
        default: 5
      },
      yGrid: {
        type: Boolean,
        default: true
      },
      yPercent: {
        type: Boolean,
        default: false
      },
      showDataTypeUnit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      this.chart = null;
      return {
        parsedData: {},
        dataMaxY: 0,
        ttPopperOptions: {
          gpuAcceleration: false,
          boundariesPadding: 10,
          preventOverflowOrder: ['left', 'right'],
          modifiers: [
            'shift',
            'offset',
            'preventOverflow',
            'keepTogether',
            'arrow',
            'applyStyle'
          ]
        }
      };
    },
    computed: {
      doGenerateLegend() {
        return this.legend && !this.$slots.legend;
      },
      area() {
        return this.data && this.data.data;
      }
    },
    watch: {
      data: {
        deep: true,
        handler() {
          this.generateData();
        }
      },
      timeUnit() {
        this.generateData();
      }
    },
    created() {
      this.chartType = 'line';
      // this.$root.$on('app.color.changed', this.renderChart);
      // this.$root.$on('app.font.changed', this.renderChart);
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
    methods: {
      doShowPointRadius(arr) {
        return arr.filter(a => a !== null).length === 1;
      },
      generateData() {
        if (this.area) {
          this.generateAreaChartDataset();
        }
        else { this.generateLineChartDataset(); }
      },
      generateAreaChartDataset() {
        this.currentState = 'LOADING';

        this.$nextTick(() => {
          if (!this.data || !this.data.data) {
            this.currentState = 'DATA_MISSING';
            return;
          }

          let hasData = true;
          const datasets = [];
          const colors = this.getColors();
          const pointBGColor = getComputedStyle(document.body).getPropertyValue('--av-fixed-danger');
          const chartTransparent = getComputedStyle(document.body).getPropertyValue('--av-chart-transparent');
          const defaultConfig = {
            pointBorderWidth: 0,
            stepped: this.stepped,
            tension: 0.1,
            borderJoinStyle: 'round',
            borderWidth: 2,
            spanGaps: true,
            pointHoverRadius: 0,
            pointBackgroundColor: pointBGColor,
            fill: false,
            showLine: true,
            pointRadius: 0,
            segment: {
              borderDash: (ctx) => {
                if (ctx.p0.skip || ctx.p1.skip) {
                  return [5, 5];
                }
                return undefined;
              }
            }
          };
          const labels = [];
          for (let index = 0; index < this.data.data.length; index++) {
            const dataset = this.data.data[index];
            labels.push(...dataset.points.map(point => new Date(point.x)));
            const {
              points = []
            } = dataset;

            if (!points.length) {
              hasData = false;
              break;
            }

            if (!isValidData(points, 'timestamp coordinate')) {
              hasData = false;
              break;
            }

            const localdataMaxY = getDataMaxY(points.map(point => point.y));
            if (localdataMaxY > this.dataMaxY) {
              this.dataMaxY = localdataMaxY;
            }

            datasets.push({
              ...defaultConfig,
              label: dataset.name,
              data: cleanData(points.map(point => point.y), this.precision),
              pointHoverRadius: this.dataPointOnHover ? POINT_HOVER_RADIUS : 0,
              borderColor: colors[index],
              backgroundColor: 'transparent',
              pointRadius: (context) => {
                if (this.variableThreshold) {
                  const point = context.dataset.data[context.dataIndex];
                  return this.doesExceedThreshold(point, points[context.dataIndex]) ? POINT_RADIUS : 0;
                }
                return 0;
              },
              pointHoverBackgroundColor: (context) => {
                if (this.variableThreshold) {
                  const point = context.dataset.data[context.dataIndex];
                  return point > point.higherThreshold
                    || point < point.lowerThreshold
                    ? pointBGColor
                    : colors[index];
                }
                return colors[index];
              }
            });
            if (this.variableThreshold) {
              const lowerThresholds = cleanData(points.map(point => point.lowerThreshold), this.precision);
              datasets.push({
                ...defaultConfig,
                label: 'Lower threshold',
                data: lowerThresholds,
                pointHitRadius: 0,
                pointHoverRadius: 0,
                pointBorderWidth: 0,
                pointRadius: 0,
                stepped: this.stepped,
                fill: '-1',
                showLine: true,
                borderWidth: this.area ? 2 : 1,
                borderJoinStyle: 'round',
                backgroundColor: chartTransparent,
                borderColor: 'transparent',
                threshold: true
              });

              const higherThresholds = cleanData(points.map(point => point.higherThreshold), this.precision);
              datasets.push({
                ...defaultConfig,
                label: 'Upper threshold',
                data: higherThresholds,
                pointHitRadius: 0,
                pointHoverRadius: 0,
                pointBorderWidth: 0,
                pointRadius: 0,
                stepped: this.stepped,
                fill: '-1',
                showLine: true,
                borderWidth: this.area ? 2 : 1,
                borderJoinStyle: 'round',
                backgroundColor: chartTransparent,
                borderColor: 'transparent',
                threshold: true
              });
            }
          }
          if (!hasData) {
            this.currentState = 'DATA_FAILED';
            return null;
          }
          this.parsedData = {
            labels,
            datasets
          };
          this.currentState = 'DATA_READY';
        });
      },
      generateLineChartDataset() {
        this.currentState = 'LOADING';

        this.$nextTick(() => {
          if (!this.data || !this.data.labels || !this.data.series) {
            this.currentState = 'DATA_MISSING';
            return;
          }

          let hasData = true;
          const datasets = [];
          const colors = this.getColors();
          for (let index = 0; index < this.data.series.length; index++) {
            const dataset = this.data.series[index];
            const {
              points = []
            } = dataset;
            if (!isValidData(points, 'single')) {
              hasData = false;
              break;
            }
            const localdataMaxY = getDataMaxY(points);
            if (localdataMaxY > this.dataMaxY) {
              this.dataMaxY = localdataMaxY;
            }
            datasets.push({
              label: dataset.name,
              data: cleanData(points, this.precision),
              pointBorderWidth: 0,
              pointRadius: this.doShowPointRadius(points) ? POINT_RADIUS : 0,
              pointBackgroundColor: colors[index],
              pointHoverRadius: this.dataPointOnHover ? POINT_HOVER_RADIUS : 0,
              stepped: this.stepped,
              fill: false,
              borderWidth: 2,
              spanGaps: true,
              borderColor: colors[index]
            });
          }
          if (!hasData) {
            this.currentState = 'DATA_FAILED';
            return null;
          }
          this.parsedData = {
            labels: this.data.labels,
            datasets
          };
          this.currentState = 'DATA_READY';
        });
      },
      renderChart() {
        if (this.chart) {
          this.chart.destroy();
        }
        if (!this.$refs.chartCanvas)
          return;
        const ctx = this.$refs.chartCanvas.getContext('2d');
        const gridBorderColor = getComputedStyle(document.body).getPropertyValue('--av-fixed-neutral-light');
        const tickColor = getComputedStyle(document.body).getPropertyValue('--av-fixed-primary');
        const fontFamily = document.activeElement.style.getPropertyValue('--ui-kit-font');
        const htmlLegendPlugin = {
          id: 'htmlLegend',
          afterUpdate: this.doGenerateLegend ? this.generateLegend : this.addLegendEvents
        };
        this.chart = new Chart(
          ctx,
          {
            type: 'line',
            options: {
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index'
              },
              resizeDelay: 200,
              fill: false,
              radius: 0,
              scales: {
                x: {
                  beginAtZero: true,
                  type: 'time',
                  time: {
                    unit: this.timeUnit,
                    displayFormats: {
                      second: this.localeTimeFormat() === '24H' ? 'HH:mm:ss' : 'hh:mm:ss a',
                      minute: this.localeTimeFormat() === '24H' ? 'HH:mm' : 'hh:mm a',
                      hour: this.localeTimeFormat() === '24H' ? 'HH:mm' : 'hh:mm a',
                      day: 'dd MMM',
                      month: 'MMMM yyyy',
                      year: 'yyyy'
                    }
                  },
                  grid: {
                    display: this.xGrid,
                    drawBorder: this.xAxis,
                    borderWidth: 0,
                    borderColor: gridBorderColor,
                    color: gridBorderColor
                  },
                  ticks: {
                    maxRotation: 0,
                    autoSkipPadding: 20,
                    color: tickColor,
                    font: {
                      size: 12,
                      family: fontFamily,
                      weight: 400
                    }
                  }
                },
                y: {
                  beginAtZero: true,
                  ...(this.data?.maxY
                    ? {
                      max: this.data?.maxY,
                      suggestedMax: this.data?.maxY
                    }
                    : {}),
                  grid: {
                    display: this.yGrid,
                    drawBorder: this.yAxis,
                    borderWidth: 0,
                    borderColor: gridBorderColor,
                    color: gridBorderColor
                  },
                  ticks: {
                    color: tickColor,
                    font: {
                      size: 12,
                      family: fontFamily,
                      weight: 400
                    },
                    callback: this.formatValue,
                    maxTicksLimit: (['speed', 'speed_bits', 'size'].includes(this.parsedDataType)) && this.dataMaxY <= 3 ? 2 : this.yAxisTicksUpperLimit,
                    autoSkip: true
                  }
                }
              },
              hover: {
                mode: 'index',
                intersect: false
              },
              plugins: {
                tooltip: {
                  enabled: false,
                  position: 'nearest',
                  mode: 'index',
                  ...(
                    this.tooltip
                      ? {
                        external: this.renderTooltip
                      }
                      : {}
                  )
                },
                legend: {
                  display: false
                },
                annotation: {
                  annotations: this.addThresholdAnnotation
                }
              },
              onHover: this.onCanvasHover,
              onClick: this.onCanvasClick
            },
            data: this.parsedData,
            plugins: [htmlLegendPlugin]
          }
        );
      },
      addLegendEvents(chart) {
        this.$nextTick(() => {
          if (!this.$refs.legend)
            return;
          const legends = this.$refs.legend.querySelectorAll('.acv-line-chart__legend__item');
          legends.forEach((legend, index) => {
            legend.addEventListener('mouseenter', () => this.onLegendHover(index, chart));
            legend.addEventListener('mouseleave', () => this.onLegendHoverOut(index, chart));
          });
        });
      },
      generateLegend(chart) {
        const getOrCreateLegendList = () => {
          const legendContainer = this.$refs.legend;
          let listContainer = legendContainer.querySelector('ul');

          if (!listContainer) {
            listContainer = document.createElement('ul');
            listContainer.style.display = 'inline-flex';
            listContainer.style.flexWrap = 'wrap';
            listContainer.style.flexDirection = 'row';
            listContainer.style.margin = 0;
            listContainer.style.padding = 0;

            legendContainer.appendChild(listContainer);
          }
          return listContainer;
        };

        const ul = getOrCreateLegendList();
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const { datasets } = chart.data;

        datasets.forEach((item, index) => {
          const dataValue = item.data[item.data.length - 1];
          const li = document.createElement('li');
          li.style.alignItems = 'center';
          li.style.cursor = 'pointer';
          li.style.display = 'flex';
          li.style.flexDirection = 'row';
          li.className = 'acv-line-chart__legend__item acv-text acv-text--body-24 mr-16';

          li.onmouseenter = () => this.onLegendHover(index, chart);
          li.onmouseleave = () => this.onLegendHoverOut(index, chart);

          // Color bullet
          const bulletContainer = document.createElement('span');
          bulletContainer.className = 'acv-line-chart__legend__bullet';

          const bullet = document.createElement('span');
          bullet.style.background = item.borderColor;

          bulletContainer.appendChild(bullet);

          // Label
          const labelContainer = document.createElement('span');
          labelContainer.className = 'acv-line-chart__legend__label';

          const label = document.createTextNode(item.label);
          labelContainer.appendChild(label);

          const separatorContainer = document.createElement('span');
          separatorContainer.className = 'acv-line-chart__legend__separator mr-8';

          const separator = document.createTextNode(':');
          separatorContainer.appendChild(separator);

          // Value
          const valueContainer = document.createElement('span');
          valueContainer.className = 'acv-line-chart__legend__value';
          let value;
          if (dataValue === null || Number.isNaN(dataValue)) {
            value = document.createTextNode(this.t('acv.lineChart.latestDataNA'));
          }
          else {
            value = document.createTextNode(
              this.formatValue(dataValue)
            );
          }
          valueContainer.appendChild(value);
          if (!item.threshold) {
            li.appendChild(bulletContainer);
          }
          li.appendChild(labelContainer);
          li.appendChild(separatorContainer);
          li.appendChild(valueContainer);
          ul.appendChild(li);
        });
      },
      formatValue(value) {
        const label = this.yPercent
          ? this.getPercent(value, this.data?.maxY || 100)
          : this.appendUnit(value, this.parsedDataType, this.precision);
        if (this.showDataTypeUnit) {
          return `${label}/${this.timeUnit[0]}`;
        }
        return label;
      },
      getPercent(value, maxValue) {
        return `${Number((value / maxValue * 100).toFixed(this.precision))} %`;
      },
      onLegendHover(index, chart) {
        const legends = this.$refs.legend.querySelectorAll('.acv-line-chart__legend__item');
        chart.data.datasets.forEach((data, datasetIndex) => {
          if (datasetIndex !== index && !data.threshold) {
            const color = this.fadedColors[datasetIndex];
            const metadata = chart.getDatasetMeta(datasetIndex);
            metadata.dataset.options.borderColor = color;
            metadata._dataset.borderColor = color;
            legends[datasetIndex].style.opacity = 0.2;
          }
        });
        chart.draw();
      },
      onLegendHoverOut(index, chart) {
        const legends = this.$refs.legend.querySelectorAll('.acv-line-chart__legend__item');
        chart.data.datasets.forEach((data, datasetIndex) => {
          if (datasetIndex !== index && !data.threshold) {
            const color = this.getColors()[datasetIndex];
            const metadata = chart.getDatasetMeta(datasetIndex);
            metadata.dataset.options.borderColor = color;
            metadata._dataset.borderColor = color;
            legends[datasetIndex].style.opacity = 1;
          }
        });
        chart.draw();
      },
      doesExceedThreshold(point, dataset) {
        if (!this.variableThreshold) {
          return false;
        }
        if (dataset.higherThreshold && point > dataset.higherThreshold) {
          return true;
        }
        if (dataset.lowerThreshold && point < dataset.lowerThreshold) {
          return true;
        }
        return false;
      },
      onCanvasHover(event) {
        const {
          x: xPosition,
          chart: {
            ctx: context,
            chartArea: {
              top,
              bottom
            }
          }
        } = event;

        event.chart.clear();
        event.chart.draw();
        if (this.$refs.tooltipPopover) {
          if (!this.$refs.tooltipPopover.showPopper) {
            this.$refs.tooltipPopover.doShow();
          }
          this.$refs.tooltipPopover.popperElm.style.opacity = 1;
          this.$refs.tooltipPopover.updatePopper();
        }
        context.beginPath();
        context.moveTo(xPosition, top);
        context.lineTo(xPosition, bottom);
        context.lineWidth = 1;
        context.strokeStyle = getComputedStyle(document.body).getPropertyValue(
          '--av-brand-primary'
        );
        context.stroke();
      },
      renderTooltip(context) {
        const { tooltip, chart } = context;
        const popover = this.$refs.tooltipPopover;
        if (tooltip.body) {
          const titleLine = format(parse(tooltip.title.toString(), 'MMM d, yyyy, h:mm:ss aaaa', new Date()), this.tooltipTimeFormat) || '';
          const tooltipTitle = document.createElement('div');
          tooltipTitle.className = 'acv-text acv-text--strong acv-line-chart__tooltip-title';
          const text = document.createTextNode(titleLine);
          tooltipTitle.appendChild(text);
          const tooltipContent = document.createElement('div');
          tooltipContent.className = 'acv-line-chart__tooltip-content';
          tooltip.dataPoints.forEach((point, index) => {
            const colors = tooltip.labelColors[index];
            const tooltipContentWrapper = document.createElement('div');
            tooltipContentWrapper.className = 'mb-8';

            if (!this.variableThreshold) {
              const tooltipBullet = document.createElement('div');
              tooltipBullet.className = 'acv-line-chart__bullet';
              tooltipBullet.style.background = colors.borderColor;
              tooltipBullet.style.border = colors.borderColor;
              tooltipContentWrapper.appendChild(tooltipBullet);
            }
            const tooltipLabel = document.createElement('div');
            tooltipLabel.className = 'acv-line-chart__tooltip-label';
            const valueLabel = point.dataset.label;
            const valueRaw = this.formatValue(point.raw);
            const labelText = document.createTextNode(`${valueLabel} : ${valueRaw}`);
            tooltipLabel.appendChild(labelText);
            tooltipContentWrapper.appendChild(tooltipLabel);
            tooltipContent.appendChild(tooltipContentWrapper);
          });

          const tooltipRoot = popover.popperElm.querySelector('.acv-line-chart__tooltip-wrapper');

          if (!this.$slots.tooltipbody) {
            tooltipRoot.replaceChildren();
            tooltipRoot.appendChild(tooltipTitle);
            tooltipRoot.appendChild(tooltipContent);
          }
          else {
            if (tooltipRoot.firstChild && tooltipRoot.firstChild.classList.contains('acv-line-chart__tooltip-title')) {
              tooltipRoot.removeChild(tooltipRoot.firstChild);
            }
            tooltipRoot.prepend(tooltipTitle);
          }
        }
        const {
          offsetLeft: positionX
        } = chart.canvas;
        if (this.$refs.tooltipReference) {
          this.$refs.tooltipReference.style.left = `${positionX + tooltip.caretX}px`;
        }
      },
      onCanvasLeave() {
        if (this.$refs.tooltipPopover) {
          this.$refs.tooltipPopover.popperElm.style.opacity = 0;
        }
      },
      onCanvasClick(event) {
        const {
          x: xPosition,
          y: yPosition,
          chart: {
            ctx: context,
            chartArea: {
              left,
              right,
              top,
              bottom
            }
          }
        } = event;
        event.chart.clear();
        event.chart.draw();
        if (
          xPosition >= left
          && xPosition <= right
          && yPosition <= bottom
          && yPosition >= top
        ) {
          context.beginPath();
          context.moveTo(xPosition, top);
          context.lineTo(xPosition, bottom);
          context.lineWidth = 1;
          context.strokeStyle = getComputedStyle(document.body).getPropertyValue(
            '--av-brand-primary'
          );
          context.stroke();
        }
        if (this.chart) {
          const time = this.chart.scales.x.getValueForPixel(event.native.layerX);
          this.$emit('timelineClick', time, event);
        }
      },
      addThresholdAnnotation({ chart }) {
        const { ctx } = chart;

        let dataToProcess = this.area ? this.data.data : this.data.series;
        dataToProcess = dataToProcess.filter(data => data.threshold);
        const thresholdColor = getComputedStyle(document.body).getPropertyValue('--av-fixed-danger');
        const fontFamily = document.activeElement.style.getPropertyValue('--ui-kit-font');
        const outlineStrokeColor = getComputedStyle(document.body).getPropertyValue('--av-inversed-primary');
        if (!dataToProcess.length || !ctx)
          return;
        return dataToProcess
          .map((data) => {
            let text = this.yPercent
              ? this.getPercent(data.threshold, this.data?.maxY || 100)
              : this.appendUnit(data.threshold, this.parsedDataType, this.precision);
            if (data.thresholdText) {
              text = data.thresholdText;
            }
            return {
              type: 'line',
              yMin: data.threshold,
              yMax: data.threshold,
              borderWidth: 2,
              borderColor: thresholdColor,
              borderDash: [5, 5],
              drawTime: 'afterDatasetsDraw',
              label: {
                content: text,
                enabled: true,
                color: thresholdColor,
                drawTime: 'afterDatasetsDraw',
                backgroundColor: outlineStrokeColor,
                position: 'start',
                yAdjust: -12,
                yPadding: 0,
                font: {
                  style: 'bold',
                  family: fontFamily,
                  size: 12
                }
              }
            };
          });
      },
      localeTimeFormat() {
        const dateObj = new Date();
        const localeFormat = dateObj.toLocaleTimeString();
        if (/[a-z]/i.test(localeFormat)) {
          return '12H';
        }
        return '24H';
      }
    }
  };
</script>

<template>
  <div
    class="acv-line-chart"
  >
    <WidgetLoading v-if="isLoading" />
    <WidgetEmpty v-else-if="isEmpty" />
    <WidgetInvalid v-else-if="isFailed" />
    <template v-else>
      <div
        v-if="legend"
        ref="legend"
        class="acv-line-chart__legend pb-8"
      >
        <template v-if="$slots.legend">
          <slot name="legend" />
        </template>
      </div>
      <div
        class="acv-line-chart__drawing"
        :style="{ height, width: renderWidth }"
      >
        <canvas
          ref="chartCanvas"
          @mouseleave="onCanvasLeave"
        />
        <AcvPopover
          v-if="tooltip"
          ref="tooltipPopover"
          placement="top"
          trigger="manual"
          pointer="arrow"
          popper-class="acv-line-chart__tooltip"
          :popper-options="ttPopperOptions"
        >
          <div class="acv-text acv-text--body-24 acv-line-chart__tooltip-wrapper">
            <template v-if="$slots.tooltipbody">
              <slot
                name="tooltipbody"
                :chart-data="chart"
              />
            </template>
          </div>
        </AcvPopover>
        <!--        FIXME v-popover is removed -->
        <div
          v-if="tooltip"
          ref="tooltipReference"
          v-popover:tooltipPopover
          class="acv-line-chart__tooltip-reference"
        />
      </div>
    </template>
  </div>
</template>
