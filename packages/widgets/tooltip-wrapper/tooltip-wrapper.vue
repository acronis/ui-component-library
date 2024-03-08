<script lang="jsx">
import ObserverMixin from '@/mixins/resizeObserver.mixin';
import ElTooltip from 'packages/tooltip';

function runOnce(fn, context) {
  let result;
  let func = fn;

  return (args) => {
    if (func) {
      result = func.apply(context || this, args);
      func = null;
    }

    return result;
  };
}

export default {
  name: 'ElTooltipWrapper',
  mixins: [ObserverMixin],
  components: {
    ElTooltip
  },
  props: {
    tooltipText: {
      type: [String, Number, Boolean]
    },
    resizable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
      displayTooltip: false,
      ready: false // prevent resize events until first mouseenter event emitted
    };
  },
  watch: {
    displayTooltip(value, prevValue) {
      if (value && !prevValue && this.$refs.tooltip) {
        this.$refs.tooltip && (this.$refs.tooltip.showPopper = true);
      }
    }
  },
  methods: {
    async onResize() {
      if (this.ready && this.resizable) {
        await this.$nextTick();
        this.enableTooltip();
      }
    },
    enableTooltip() {
      if (this.disabled) return;

      if (!this.tooltipText) {
        this.displayTooltip = false;
        return;
      }
      this.ready = true;
      const { inner } = this.$refs;

      if (inner) {
        const contentData = inner.getBoundingClientRect();
        const elementData = this.$el.getBoundingClientRect();

        this.displayTooltip = contentData.width > elementData.width;
      }
    }
  },
  render() {
    const events = {
      on: {
        mouseenter: runOnce(this.enableTooltip)
      }
    };

    const body = this.displayTooltip ? (
      <el-tooltip
        ref="tooltip"
        title=""
        enterable={false}
        placement="top-start"
        content={this.tooltipText}
        class="with-tooltip qa-with-tooltip"
      >
        <span class="content"><span ref="inner" class="inner">{this.$slots.default?.()}</span></span>
      </el-tooltip>
    ) : (
      <span
        class="content no-tooltip qa-no-tooltip"
      ><span ref="inner" class="inner qa-tooltip-wrapper-name">{this.$slots.default?.()}</span></span>
    );

    return (
      <span
        ref="tooltip"
        class="el-tooltip-wrapper qa-tooltip"
        {...events}
      >
        { body }
      </span>
    );
  }
};
</script>
