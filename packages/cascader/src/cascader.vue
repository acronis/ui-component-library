<template>
  <div
    ref="reference"
    v-clickoutside="() => toggleDropDownVisible(false)"
    :class="[
      'el-cascader',
      { 'is-disabled': isDisabled }
    ]"
    @click="() => toggleDropDownVisible()"
    @keydown="handleKeyDown"
  >
    <slot name="trigger">
      <el-button
        ref="button"
        :type="buttonType"
        :class="{ 'is-focus': dropDownVisible }"
        :disabled="isDisabled"
      >
        {{ placeholder }}
      </el-button>
    </slot>
    <transition name="el-cascader-fade">
      <div
        v-show="dropDownVisible"
        ref="popper"
        :class="['el-popper', 'el-cascader__dropdown', 'my-8', popperClass]"
      >
        <el-cascader-panel
          ref="panel"
          v-model="checkedValue"
          :options="options"
          :props="config"
          :render-label="$slots.default"
          :style="panelStyles"
          @expand-change="handleExpandChange"
          @close="toggleDropDownVisible(false, true)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Popper from '@/utils/vue-popper';
import HidePopper from '@/mixins/hidePopper';
import Clickoutside from '@/utils/clickoutside';
import Emitter from '@/mixins/emitter';
import Locale from '@/mixins/locale';
import ElButton from 'packages/button';
import { isEqual } from '@/utils/util';
import { isDef } from '@/utils/shared';
import eventBus from '@/utils/eventBus';
import ElCascaderPanel from './cascader-panel.vue';

const PopperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    buttonType: {
      type: String,
      default: 'primary'
    }
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

export default {
  name: 'ElCascader',

  directives: { Clickoutside },

  components: {
    ElCascaderPanel,
    ElButton
  },

  mixins: [PopperMixin, Emitter, Locale, HidePopper],

  provide() {
    return {
      cascader: this
    };
  },

  props: {
    options: Array,
    placeholder: {
      type: String,
      default: () => 'Click here'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    expandHistory: {
      type: Boolean,
      default: false
    },
    popperClass: String,
    menuMaxHeight: {
      type: Number,
      default: 400
    },
    loadOptions: Function
  },

  data() {
    return {
      dropDownVisible: false,
      checkedValue: this.value || null,
      value: null
    };
  },

  computed: {
    isDisabled() {
      return this.disabled;
    },
    config() {
      return {
        lazy: !!this.loadOptions,
        lazyLoad: this.loadOptions
      };
    },
    panelStyles() {
      return {
        '--menuMaxHeight': `${this.menuMaxHeight}px`
      };
    }
  },

  watch: {
    value(val) {
      if (!isEqual(val, this.checkedValue)) {
        this.checkedValue = val;
      }
    },
    checkedValue(val) {
      const { value } = this;

      if (!isEqual(val, value) || (value === undefined)) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
    }
  },

  created() {
    eventBus.$on('onHidePopper', this.handleClose);
  },

  methods: {
    toggleDropDownVisible(visible, doReturnFocus = false) {
      if (this.isDisabled) return;

      const { dropDownVisible, expandHistory } = this;
      const isVisible = isDef(visible) ? visible : !dropDownVisible;

      if (isVisible !== dropDownVisible) {
        this.dropDownVisible = isVisible;
        if (isVisible) {
          this.$nextTick(() => {
            this.updatePopper();
          });
        }
        this.$emit('visible-change', isVisible);
      }

      if (!expandHistory && !isVisible) {
        const { panel } = this.$refs;
        panel.reset();
      }

      if (doReturnFocus) {
        this.$nextTick(() => {
          this.$refs.button?.$el.focus();
        });
      }
    },
    handleKeyDown(event) {
      switch (event.keyCode) {
        case 13:
          this.toggleDropDownVisible();
          event.preventDefault();
          break;
        case 40:
          this.toggleDropDownVisible(true);
          this.focusFirstNode();
          event.preventDefault();
          break;
        case 27:
        case 9:
          this.toggleDropDownVisible(false);
          break;
        default:
      }
    },
    handleExpandChange(value) {
      this.$nextTick(this.updatePopper.bind(this));
      this.$emit('expand-change', value);
    },
    focusFirstNode() {
      this.$nextTick(() => {
        const { popper } = this.$refs;
        let firstNode = null;

        const firstMenu = popper.querySelector('.el-cascader-menu');
        firstNode = firstMenu.querySelector('.el-cascader-node[tabindex="-1"]');

        if (firstNode) {
          firstNode.focus();
          firstNode.click();
        }
      });
    },
    handleClose() {
      this.toggleDropDownVisible(false);
    }
  }
};
</script>
