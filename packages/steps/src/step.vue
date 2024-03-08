<template>
  <div
    class="el-step"
    :style="style"
    :class="{
      [`is-${$parent.direction}`]: !isSimple,
      'is-clickable': currentStatus === 'finish' && onClick,
      'is-numeric': $parent.numeric,
      'is-simple': isSimple,
      'is-flex': isLast && !space && !isCenter,
      'is-center': isCenter && !isVertical && !isSimple
    }"
    @click="handleClick"
  >
    <!-- icon & line -->
    <div
      class="el-step__head"
      :class="`is-${currentStatus}`"
    >
      <div
        class="el-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
      >
        <i
          v-if="!isSimple"
          class="el-step__line-inner"
          :style="lineStyle"
        />
      </div>

      <div
        class="el-step__icon"
        :class="`is-${withIcon ? 'icon' : 'text'}`"
      >
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon"
        >
          <el-icon
            v-if="icon"
            class="el-step__icon-inner"
            :name="icon"
          />
          <div
            v-if="!icon && !isSimple && $parent.numeric"
            class="el-step__icon-inner"
          >
            {{ index + 1 }}
          </div>
        </slot>
        <el-icon
          v-else-if="$parent.numeric || icon"
          :name="currentStatus === 'success' ? 'i-check--16' : 'i-times--16'"
          class="el-step__icon-inner is-status"
        />
      </div>
    </div>
    <!-- title & description -->
    <div class="el-step__main">
      <div
        ref="title"
        class="el-step__title"
        :class="['is-' + currentStatus]"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div
        v-if="isSimple"
        class="el-step__arrow"
      />
      <div
        v-else
        class="el-step__description"
        :class="['is-' + currentStatus]"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import ElIcon from 'packages/icon';

export default {
  name: 'ElStep',

  components: {
    ElIcon
  },

  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },

  emits: ['click'],

  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ''
    };
  },

  computed: {
    currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : 'wait';
    },
    isCenter() {
      return this.$parent.alignCenter;
    },
    isVertical() {
      return this.$parent.direction === 'vertical';
    },
    isSimple() {
      return this.$parent.simple;
    },
    isLast() {
      const parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    stepsCount() {
      return this.$parent.steps.length;
    },
    space() {
      const { isSimple, $parent: { space } } = this;
      return isSimple ? '' : space;
    },
    style() {
      const style = {};
      const parent = this.$parent;
      const len = parent.steps.length;

      style.flexBasis = (typeof this.space === 'number'
        ? `${this.space}px`
        : this.space
          ? this.space
          : `${100 / (len - 1)}%`);
      if (this.isVertical) return style;
      if (this.isLast) {
        style.maxWidth = `${100 / this.stepsCount}%`;
      } else {
        style.marginRight = `${-this.$parent.stepOffset}px`;
      }

      return style;
    },
    withIcon() {
      return this.icon || this.$slots.icon;
    }
  },

  beforeCreate() {
    this.$parent.steps.push(this);
  },

  beforeUnmount() {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },

  mounted() {
    const unwatch = this.$watch('index', () => {
      this.$watch('$parent.active', this.updateStatus, { immediate: true });
      unwatch();
    });
  },

  methods: {
    handleClick(event) {
      // TODO: Vue 3 migration check listener
      if (this.currentStatus !== 'finish' || !this.onClick) {
        return;
      }

      this.$emit('click', event);
    },
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1];

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = 'wait';
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },

    calcProgress(status) {
      let step = 100;
      const style = {};

      style.transitionDelay = `${150 * this.index}ms`;
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 100 : 0;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = `${-150 * this.index}ms`;
      }

      style.borderWidth = step ? '1px' : 0;
      this.$parent.direction === 'vertical'
        ? style.height = `${step}%`
        : style.width = `${step}%`;

      this.lineStyle = style;
    }
  }
};
</script>
