import { prettySize } from "@utils/ui-utils";
import { t } from '@/locale';
import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
import { isValidColor, chartColors } from 'colors/js/utils/color-utils';
import { cssValue } from 'colors/js/utils/color-converters';
import { getFadedColors } from '../../../src/utils/widget';
import { getLocale } from '../../../examples/utils/local-storage';

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
        addResizeListener(this.$el.parentNode, this.setRenderWidth);
        this.resizeListenerAdded = true;
      }
    });
  },
  beforeDestroy() {
    if (this.resizeListenerAdded && this.$el?.parentNode) {
      removeResizeListener(this.$el.parentNode, this.setRenderWidth);
    }
  },
  filters: {
    appendUnit(value, dataType, precision) {
      const lang = getLocale() || 'en-US';
      const options = {
        locale: lang,
        allowFloat: true,
        precision: precision,
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
    }
  },
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
    setRenderWidth() {
      if (this.$el?.parentNode?.clientWidth) {
        const leftPadding = window.getComputedStyle(this.$el.parentNode).paddingLeft
          ? parseInt(window.getComputedStyle(this.$el.parentNode).paddingLeft, 10)
          : 0;
        const rightPadding = window.getComputedStyle(this.$el.parentNode).paddingRight
          ? parseInt(window.getComputedStyle(this.$el.parentNode).paddingRight, 10)
          : 0;
        this.renderWidth = `${this.$el.parentNode.clientWidth - leftPadding - rightPadding}px`;
      } else {
        this.renderWidth = `${this.width}px`;
      }
    },
    renderTooltip(x) {
      if (this.tooltip) {
        const mouseX = parseInt(x, 10);
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
        return this.data.sets[0].colors.map((color) => (isValidColor(color) ? color : cssValue(color)));
      }
      return this.colors.map((color) => (isValidColor(color) ? color : cssValue(color)));
    }
  }
};
