<template>
  <li
    v-if="!isInRemoteSelected"
    v-show="forceVisible || visible"
    class="el-select-dropdown__item"
    :title="title"
    :class="{
      'selected': itemSelected && !showCheckbox && showSelectedHighlighting,
      'is-disabled': disabled || groupDisabled || limitReached,
      'hover': hover,
      'is-multi-line': isMultiLine
    }"
    @click="selectOptionClick"
    @touchend="selectOptionTouchEnd"
  >
    <slot>
      <template v-if="!!$slots.prefix">
        <slot name="prefix" />
      </template>
      <el-checkbox
        v-if="showCheckbox"
        class="mr-8"
        :value="itemSelected"
        :indeterminate="indeterminate"
        :disabled="disabled"
        @click.prevent
      />
      <el-icon
        v-if="icon"
        :name="icon"
        :color="iconColor"
        class="mr-8 el-select-dropdown__item-icon"
      />
      <span
        v-if="!isMultiLine"
        ref="text"
        :class="!!$slots.suffix ? 'el-select-dropdown__suffix' : null"
      >
        <span v-highlight="keyword">{{ text }}</span>
      </span>
      <span
        v-else
        ref="text"
        :class="!!$slots.suffix ? 'el-select-dropdown__suffix' : null"
      >
        <span
          v-highlight="keyword"
          class="el-text el-text--strong label"
        >
          {{ text }}
        </span>
        <span class="ml-8">
          <el-icon
            v-for="(icon, i) in rightIcons"
            :key="i"
            :name="icon.name"
            :color="icon.color"
            class="el-select-dropdown__item-icon"
          />
        </span>
        <span
          v-highlight="keyword"
          class="el-text el-text--caption sublabel"
        >
          {{ subLabel }}
        </span>
      </span>
      <template v-if="!!$slots.suffix">
        <slot name="suffix" />
      </template>
    </slot>
  </li>
</template>

<script>
import ElCheckbox from 'packages/checkbox';
import ElIcon from 'packages/icon';
import Highlight from 'packages/highlight';
import eventBus from '@/utils/eventBus';
import { isEqual } from '@/utils/util';

export default {

  name: 'ElOption',

  components: {
    ElIcon,
    ElCheckbox
  },

  directives: {
    Highlight
  },

  componentName: 'ElOption',

  inject: ['select'],

  props: {
    // TODO check modelValue
    value: {
      required: true
    },
    label: [String, Number],
    subLabel: {
      type: [String, Number],
      default: ''
    },
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: 'brand-primary'
    },
    rightIcons: {
      type: Array,
      default: () => []
    },
    // internal API used in select
    forceVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false,
      text: '',
      keyword: '',
      title: '',
      selected: false
    };
  },

  computed: {
    showCheckbox() {
      return this.select.multiple;
    },

    isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
    },

    currentLabel() {
      return this.label || (this.isObject ? '' : this.value);
    },
    indeterminate() {
      if (this.select.multiple && this.select.selectAll) {
        return this.select.selected.length > 0 && this.value === 'all' && !this.select.options[0].itemSelected;
      }
      return false;
    },

    itemSelected: {
      set(value) {
        this.selected = value;
      },
      get() {
        if (!this.select.multiple) {
          return isEqual(this.value, this.select.value);
        }
        return this.contains(this.select.value, this.value) || this.selected;
      }
    },

    showSelectedHighlighting() {
      return !(this.itemSelected && this.select.keyboardNavigate && this.hover);
    },

    limitReached() {
      return this.select.multiple && !this.itemSelected
          && (this.select.value || []).length >= this.select.multipleLimit
          && this.select.multipleLimit > 0;
    },

    isInRemoteSelected() {
      // In the select remote search, options selected will show at the top of dropdown.
      // This is to check wether option is already in the remote selected sction.
      if (!this.forceVisible && this.select.remote && this.select.filterable && this.select.multiple
          && this.select.previousSelected && this.select.previousSelected.length
          && !this.select.query.length) {
        if (this.select.previousSelected.some((selectedOption) => isEqual(selectedOption.value, this.value))) {
          return true;
        }
      }
      return false;
    },

    isMultiLine() {
      return this.subLabel !== '';
    },

    isEnabled() {
      return this.disabled !== true && this.groupDisabled !== true;
    }
  },

  watch: {
    currentLabel(v) {
      if (!this.created && !this.select.remote) {
        eventBus.$emit('el.select.setSelected');
        // this.dispatch('ElSelect', 'setSelected')
      }

      this.text = v;
    },

    value() {
      if (!this.created && !this.select.remote) {
        eventBus.$emit('el.select.setSelected');
        // this.dispatch('ElSelect', 'setSelected')
      }
    }
  },

  created() {
    const isCached = this.select.cachedOptions.find((option) => option.value === this.value);
    if (!isCached) {
      this.select.cachedOptions.push(this);
    }
    if (!this.isInRemoteSelected) {
      this.select.options.push(this);
      this.select.optionsCount++;
      this.select.filteredOptionsCount++;
    }
    this.text = this.currentLabel;

    eventBus.$on('el.option.queryChange', this.queryChange);
    eventBus.$on('el.option.handleGroupDisabled', this.handleGroupDisabled);
    eventBus.$on('el.option.updatePopper', this.initTitleAttr);
  },

  beforeUnmount() {
    this.select.onOptionDestroy(this.select.options.indexOf(this));
  },

  methods: {
    contains(arr = [], target) {
      if (arr === undefined || arr === null) {
        return 0;
      }
      return arr.indexOf(target) > -1;
    },

    handleGroupDisabled(val) {
      this.groupDisabled = val;
    },

    selectOptionClick() {
      if (!('ontouchend' in document.documentElement) && this.isEnabled) {
        eventBus.$emit('el.select.handleOptionClick', this);
        // this.dispatch('ElSelect', 'handleOptionClick', this);
      }
    },

    selectOptionTouchEnd() {
      if (this.isEnabled) {
        eventBus.$emit('el.select.handleOptionClick', this);
        // this.dispatch('ElSelect', 'handleOptionClick', this);
      }
    },

    queryChange(query) {
      const parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
      this.visible = new RegExp(parsedQuery, 'i').test(this.currentLabel)
        || new RegExp(parsedQuery, 'i').test(this.subLabel)
        || this.created;
      if (!this.visible || this.value === this.select.selectAllValue) {
        this.select.filteredOptionsCount--;
      }
    },

    initTitleAttr() {
      this.title = this.label;
    }
  }
};
</script>
