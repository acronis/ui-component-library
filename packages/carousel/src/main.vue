<template>
  <div
    class="el-carousel"
    :style="wrapperStyles"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
  >
    <div
      class="el-carousel__container"
      :style="contStyles"
    >
      <slot></slot>
    </div>
    <el-row
      class="el-carousel__footer mt-8"
      type="flex"
    >
      <el-col :span="8">
        <transition
          v-if="arrowDisplay"
          name="carousel-arrow-left"
        >
          <div
            v-show="(navigationArrows === 'always' || hover) && (activeIndex > 0)"
            class="el-carousel__arrow el-carousel__arrow--left"
            @click.stop="throttledArrowClick(activeIndex - 1)"
          >
            <slot name="nav-arrow-backward">
              <el-button
                icon="i-chevron-left--16"
                type="ghost"
              >
              </el-button>
            </slot>
          </div>
        </transition>
      </el-col>
      <el-col :span="8">
        <transition
          v-if="indicatorDisplay"
          name="carousel-indicator"
        >
          <ul
            v-show="(slideIndicators === 'always' || hover)"
            :class="indicatorsClasses"
          >
            <li
              v-for="(n, index) in Math.ceil(items.length / this.slideCount)"
              :key="index"
              :class="[
                'el-carousel__indicator',
                { 'is-active': index === activeIndex }]"
              @mouseenter="throttledIndicatorHover(index)"
              @click.stop="handleIndicatorClick(index)"
            ></li>
          </ul>
        </transition>
      </el-col>
      <el-col :span="8">
        <transition
          v-if="arrowDisplay"
          name="carousel-arrow-right"
        >
          <div
            v-show="(navigationArrows === 'always' || hover)
            && (activeIndex < Math.ceil(items.length / this.slideCount - 1))"
            class="el-carousel__arrow el-carousel__arrow--right"
            @click.stop="throttledArrowClick(activeIndex + 1)"
          >
            <slot name="nav-arrow-forward">
              <el-button
                icon="i-chevron-right--16"
                type="ghost"
              >
              </el-button>
            </slot>
          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { throttle } from 'throttle-debounce';
import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
import ElButton from 'packages/button';
import ElCol from 'packages/col';
import ElRow from 'packages/row';

export default {
  name: 'ElCarousel',
  components: {
    ElButton,
    ElCol,
    ElRow
  },
  props: {
    autoplay: {
      type: Boolean,
      default: false
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    interval: {
      type: Number,
      default: 3000
    },
    height: {
      type: Number,
      default: 0
    },
    navigationArrows: {
      type: String,
      default: 'never',
      validator(val) {
        return ['always', 'never', 'hover'].indexOf(val) !== -1;
      }
    },
    slideCount: {
      type: Number,
      default: 1
    },
    slideIndicators: {
      type: String,
      default: 'always',
      validator(val) {
        return ['always', 'never', 'hover'].indexOf(val) !== -1;
      }
    },
    spaceWidth: {
      type: Number,
      default: 10
    },
    triggerType: {
      type: String,
      default: 'click',
      validator(val) {
        return ['hover', 'click'].indexOf(val) !== -1;
      }
    },
    width: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      items: [],
      activeIndex: -1,
      cWidth: 0,
      timer: null,
      hover: false,
      isTransitionEnabled: true,
      resizeTimer: null,
      resizeListenerAdded: false
    };
  },

  computed: {
    arrowDisplay() {
      return this.navigationArrows !== 'never';
    },

    contStyles() {
      return {
        width: `${(this.cWidth * this.items.length) + (this.spaceWidth * (this.items.length - 1))}px`,
        height: this.height ? `${this.height}px` : 'auto',
        marginLeft: `-${this.activeIndex * (this.cWidth + this.spaceWidth)}px`,
        transition: this.isTransitionEnabled
        ? 'margin-left .5s cubic-bezier(.01, .73, .57, .99) 0s'
        : 'none'
      };
    },

    wrapperStyles() {
      return {
        width: `${this.cWidth}px`
      };
    },

    indicatorDisplay() {
      return this.slideIndicators !== 'never';
    },

    indicatorsClasses() {
      const classes = ['el-carousel__indicators'];
      return classes;
    }
  },

  watch: {
    items(val) {
      if (val.length > 0) this.setActiveItem(this.initialIndex);
    },

    activeIndex(val, oldVal) {
      this.resetItemPosition();
      if (oldVal > -1) {
        this.$emit('change', val, oldVal);
      }
    }
  },

  methods: {
    handleMouseEnter() {
      this.hover = true;
      this.pauseTimer();
    },

    handleMouseLeave() {
      this.hover = false;
      this.startTimer();
    },

    updateItems() {
      this.cWidth = this.width || this.$el?.parentNode?.clientWidth || document.body.clientWidth;
      this.items = this.$children.filter((child) => child.$options.name === 'ElCarouselItem');
      this.items.forEach((item, index) => {
        if (item.$el) {
          item.$el.style.width = `${(this.cWidth - this.spaceWidth * (this.slideCount - 1)) / this.slideCount}px`;
          item.$el.style.marginLeft = index ? `${this.spaceWidth}px` : '0px';
        }
      });
    },

    resetItemPosition() {
      this.items.forEach((item, index) => {
        item.translateItem(index, this.activeIndex);
      });
    },

    playSlides() {
      if (this.activeIndex < this.items.length - 1) {
        this.activeIndex++;
      }
    },

    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    startTimer() {
      if (this.interval <= 0 || !this.autoplay || this.timer) return;
      this.timer = setInterval(this.playSlides, this.interval);
    },

    resetTimer() {
      this.pauseTimer();
      this.startTimer();
    },

    setActiveItem(pIndex) {
      let index = pIndex;
      if (typeof index === 'string') {
        const filteredItems = this.items.filter((item) => item.name === index);
        if (filteredItems.length > 0) {
          index = this.items.indexOf(filteredItems[0]);
        }
      }
      index = Number(index);
      if (isNaN(index) || index !== Math.floor(index)) {
        console.warn('[Element Warn][Carousel]index must be an integer.');
        return;
      }
      const length = this.items.length;
      if (index < 0) {
        this.activeIndex = 0;
      } else if (index >= length) {
        this.activeIndex = length - 1;
      } else {
        this.activeIndex = index;
      }
      this.resetTimer();
    },

    prev() {
      this.setActiveItem(this.activeIndex - 1);
    },

    next() {
      this.setActiveItem(this.activeIndex + 1);
    },

    handleIndicatorClick(index) {
      this.activeIndex = index;
    },

    handleIndicatorHover(index) {
      if (this.triggerType === 'hover' && index !== this.activeIndex) {
        this.activeIndex = index;
      }
    },

    handleResize() {
      this.updateItems();
      this.isTransitionEnabled = false;
      clearTimeout(this.resizeTimer);
      this.resetItemPosition();
      const activeIndex = this.activeIndex;
      this.$nextTick(() => {
        this.setActiveItem(activeIndex);
      });
      this.resizeTimer = setTimeout(() => {
        this.isTransitionEnabled = true;
      }, 500);
    }
  },

  created() {
    this.throttledArrowClick = throttle(300, true, (index) => {
      this.setActiveItem(index);
    });
    this.throttledIndicatorHover = throttle(300, (index) => {
      this.handleIndicatorHover(index);
    });
  },

  mounted() {
    this.$nextTick(() => {
      this.updateItems();
      if (this.$el?.parentNode) {
        addResizeListener(this.$el.parentNode, this.handleResize);
        this.resizeListenerAdded = true;
      }
      if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
        this.activeIndex = this.initialIndex;
      }
      this.startTimer();
    });
  },

  beforeUnmount() {
    if (this.resizeListenerAdded && this.$el?.parentNode) {
      removeResizeListener(this.$el.parentNode, this.handleResize);
    }
    this.pauseTimer();
  }
};
</script>
