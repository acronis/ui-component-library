// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck refactor mixin
import { t } from '@/locale';
import { cssValue } from '@/utils/color-converters';
import { chartColors, isValidColor } from '@/utils/color-utils.ts';
import { getLocale } from '@/utils/local-storage';
import prettySize from '@/utils/prettySize.ts';
import { getFadedColors } from '@/utils/widget.ts';
// import { addResizeListener, removeResizeListener } from '../../utils/resize-event';

const IS_LOADING = 'LOADING';
const IS_DATA_MISSING = 'DATA_MISSING';
const IS_DATA_FAILED = 'DATA_FAILED';
const IS_DATA_READY = 'DATA_READY';

export default {
  props: {
    colors: {
      type: Array,
      default: chartColors
    }
  },
  data() {
    return {
      renderWidth: null,
      resizeListenerAdded: false,
      currentState: IS_LOADING,
      chartType: null
    };
  },
  watch: {
    currentState(value) {
      if (value === IS_DATA_READY) {
        this.$nextTick(() => {
          this.renderAll();
        });
      }
    }
  },
  mounted() {
    this.setRenderWidth();
    this.generateData();
    this.$nextTick(() => {
      if (this.$el?.parentNode) {
        // addResizeListener(this.$el.parentNode, this.setRenderWidth);
        this.resizeListenerAdded = true;
      }
    });
  },
  // beforeDestroy() {
  //   if (this.resizeListenerAdded && this.$el?.parentNode) {
  //     removeResizeListener(this.$el.parentNode, this.setRenderWidth);
  //   }
  // },
  computed: {
    parsedDataType() {
      return this.data?.dataType || 'default';
    },
    fadedColors() {
      return getFadedColors(this.getColors());
    },
    isLoading() {
      return this.currentState === IS_LOADING;
    },
    isEmpty() {
      return this.currentState === IS_DATA_MISSING;
    },
    isFailed() {
      return this.currentState === IS_DATA_FAILED;
    }
  },
  methods: {
    appendUnit(value, dataType, precision) {
      const lang = getLocale() || 'en-US';
      const options = {
        locale: lang,
        allowFloat: true,
        precision,
        isFixed: true
      };
      if (dataType === 'size') {
        return prettySize(Number(value), options);
      }
      if (dataType === 'speed') {
        return `${prettySize(Number(value), options)}${t('el.widgetchart.speed')}`;
      }
      if (dataType === 'speed_bits') {
        return `${prettySize(Number(value), { ...options, bits: true })}${t('el.widgetchart.speed')}`;
      }
      if (dataType === 'temperature') {
        return `${Number((value).toFixed(precision))}°C`;
      }
      return `${Number((value).toFixed(precision))}`;
    },
    setRenderWidth() {
      if (this.$el?.parentNode?.clientWidth) {
        const leftPadding = window.getComputedStyle(this.$el.parentNode).paddingLeft
          ? Number.parseInt(window.getComputedStyle(this.$el.parentNode).paddingLeft, 10)
          : 0;
        const rightPadding = window.getComputedStyle(this.$el.parentNode).paddingRight
          ? Number.parseInt(window.getComputedStyle(this.$el.parentNode).paddingRight, 10)
          : 0;
        this.renderWidth = `${this.$el.parentNode.clientWidth - leftPadding - rightPadding}px`;
      }
      else {
        this.renderWidth = `${this.width}px`;
      }
    },
    renderTooltip(x) {
      if (this.tooltip) {
        const mouseX = Number.parseInt(x, 10);
        this.$refs.tooltipReference.style.left = `${mouseX}px`;
        this.$refs.tooltipPopover.updatePopper();
      }
    },
    renderAll() {
      if (typeof this.calculateTotal === 'function') {
        this.calculateTotal();
      }
      this.renderChart();
    },
    getColors() {
      if (this.chartType === 'pie' && this.data?.sets && this.data.sets[0]?.colors) {
        return this.data.sets[0].colors.map(color => (isValidColor(color) ? color : cssValue(color)));
      }
      return this.colors.map(color => (isValidColor(color) ? color : cssValue(color)));
    }
  }
};
