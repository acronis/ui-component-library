<template>
  <div
    class="el-progress-radial"
    :class="{[`el-progress-radial--size-${size}`]: size}"
  >
    <svg
      :width="circleSize"
      :height="circleSize"
      class="el-progress-radial__svg"
    >
      <circle
        :cx="circleCentre"
        :cy="circleCentre"
        :r="radiusFix"
        :style="{ 'stroke-width': strokeWidth }"
        class="el-progress-radial__track"
      />
      <circle
        :cx="circleCentre"
        :cy="circleCentre"
        :r="radiusFix"
        :style="fileStyle"
        :class="[color, 'el-progress-radial__track', 'el-progress-radial__paint']"
      />
    </svg>
    <transition name="el-progress-radial">
    <el-icon
      v-if="doneLoading && showIcon && icon && ((size!=='tiny')||(size==='tiny' && scoreLevel==='complete'))"
      class="el-progress-radial__icon"
      :name="icon"
      :color="`fixed-${color}`"
    />
    </transition>
    <div
      v-if="showStatus"
      class="el-progress-radial__status"
      :class="{
        ['el-progress-radial__status--shape-stacked']:size!=='tiny',
        ['el-progress-radial__status--shape-linear']:size==='tiny'}"
    >
    <div class="el-progress-radial__title">
      {{ ticker }}
    </div>
    <!-- eslint-disable @uikit/locale/no-element-text -->
    <div class="el-progress-radial__subtitle">
      /{{ mTotalValue }}
    </div>
    <!-- eslint-enable @uikit/locale/no-element-text -->
    </div>
  </div>
</template>

<script>

export default {
  name: 'ElProgressRadial',
  props: {
    currentValue: {
      type: Number,
      default: 0
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showStatus: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small',
      validator: (value) => ['tiny', 'small', 'medium', 'large'].indexOf(value) > -1
    },
    totalValue: {
      type: Number,
      default: 0
    },
    transitionDuration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      offset: '',
      ticker: 0,
      doneLoading: false
    };
  },
  computed: {
    mTotalValue() {
      let mValue = 0;
      if (this.totalValue && typeof this.totalValue === 'number') {
        const integerValue = Math.round(this.totalValue);
        if (integerValue > 9999) {
          mValue = 9999;
        } else if (integerValue < 0) {
          mValue = 0;
        } else {
          mValue = integerValue;
        }
      }
      return mValue;
    },
    scoreLevel() {
      if (this.percent && this.percent < 0.3) {
        return 'danger';
      }
      if (this.percent && this.percent >= 0.3 && this.percent < 0.7) {
        return 'warning';
      }
      if (this.percent && this.percent >= 0.7 && this.percent < 1.0) {
        return 'success';
      }
      if (this.percent && this.percent >= 1.0) {
        return 'complete';
      }
      return 'danger';
    },
    percent() {
      if (this.ticker && this.mTotalValue) {
        return this.ticker / this.mTotalValue;
      }
      return 0;
    },
    strokeWidth() {
      switch (this.size) {
        case 'tiny':
          return 2;
        case 'small':
          return 4;
        case 'medium':
          return 6;
        case 'large':
          return 8;
        default:
          return 4;
      }
    },
    radius() {
      switch (this.size) {
        case 'tiny':
          return 6;
        case 'small':
          return 20;
        case 'medium':
          return 26;
        case 'large':
          return 32;
        default:
          return 20;
      }
    },
    color() {
      switch (this.scoreLevel) {
        case 'warning':
          return 'warning';
        case 'success':
        case 'complete':
          return 'success';
        case 'danger':
          return 'danger';
        default:
          return 'danger';
      }
    },
    icon() {
      let icon = '';
      switch (this.scoreLevel) {
        case 'warning':
          icon = 'exclamation';
          break;
        case 'success':
          return '';
        case 'complete':
          icon = 'check';
          break;
        default:
          icon = 'times';
      }
      return `i-${icon}-circle--16`;
    },
    radiusFix() {
      return this.radius + this.strokeWidth / 2;
    },
    circumference() {
      return this.radiusFix * Math.PI * 2;
    },
    fileStyle() {
      return {
        strokeDashoffset: this.offset,
        '--initialStroke': this.circumference,
        '--transitionDuration': `${this.transitionDuration}ms`,
        'stroke-width': this.strokeWidth
      };
    },
    circleSize() {
      return (this.radius + this.strokeWidth) * 2;
    },
    circleCentre() {
      return this.circleSize / 2;
    }
  },
  methods: {
    increaseNumber(num) {
      const beforeNum = this.ticker;
      const afterNum = num - beforeNum;
      let interval = 50;
      let numTicks = Math.floor(this.transitionDuration / interval);
      let incrVal = Math.floor(afterNum / numTicks);
      while ((afterNum / numTicks) < 1 && (afterNum / numTicks) > -1) {
        interval += 50;
        numTicks = Math.floor(this.transitionDuration / interval);
        incrVal = Math.floor(afterNum / numTicks);
      }
      let counter = 0;
      this.progressHandler = setInterval(() => {
        this.ticker += incrVal;
        if (this.ticker < 0) {
          this.ticker = 0;
        }
        if (counter === numTicks) {
          this.ticker = beforeNum + afterNum;
          window.clearInterval(this.progressHandler);
          this.doneLoading = true;
        }
        counter++;
      }, interval / 4 * 3);
    },
    reset() {
      if (this.initTimeoutHandler) {
        clearTimeout(this.initTimeoutHandler);
      }
      if (this.progressHandler) {
        clearTimeout(this.progressHandler);
        this.doneLoading = false;
      }
    }
  },
  watch: {
    currentValue: {
      immediate: true,
      handler: function (afterValue) {
        let mValue = 0;
        if (!isNaN(afterValue)) {
          const integerValue = Math.round(parseFloat(afterValue));
          if (integerValue > 9999) {
            mValue = 9999;
          } else if (integerValue < 0) {
            mValue = 0;
          } else {
            mValue = integerValue;
          }
          if (mValue <= this.mTotalValue) {
            this.reset();
            this.initTimeoutHandler = setTimeout(() => {
              this.offset = (this.circumference * (this.mTotalValue - mValue)) / this.mTotalValue;
            }, 10);
            this.increaseNumber(mValue);
          }
        }
      }
    }
  },
  beforeUnmount() {
    this.reset();
  }
};
</script>
