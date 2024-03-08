<template>
  <el-input
    :id="id"
    ref="reference"
    v-clickoutside="handleClose"
    class="el-date-editor"
    :class="[
      'el-date-editor--' + type,
      {'is-non-editable': !editable},
      {'is-focus': pickerVisible}
    ]"
    :readonly="!editable || readonly || type === 'multi'"
    :disabled="disabled"
    :size="pickerSize"
    :name="name"
    :validate-event="false"
    :placeholder="inputPlaceholder"
    :model-value="displayValue"
    :label="label"
    :title="displayValue"
    @focus="handleFocus"
    @click="handleClick"
    @keydown="handleKeydown"
    @update:model-value="value => userInput = value"
    @mouseenter="handleMouseEnter"
    @mouseleave="showClose = false"
    @change="handleChange"
  >
    <template
      v-if="haveTrigger"
      #suffix
    >
      <el-icon
        :name=" showClose ? 'i-times--16': 'i-calendar-o--16' "
        class="el-input__icon"
        :class="{'el-input__clear': showClose}"
        @click="handleClickIcon"
      />
    </template>
  </el-input>
</template>

<script>
import { createApp, defineComponent, nextTick } from 'vue';

import ElIcon from 'packages/icon';
import ElInput from 'packages/input';
import Focus from '@/mixins/focus';
import HidePopper from '@/mixins/hidePopper';
import { t } from '@/locale';
import Clickoutside from '@/utils/clickoutside';
import eventBus from '@/utils/eventBus';
import merge from '@/utils/merge';
import Popper from '@/utils/vue-popper';

import {
  formatDate, isDate, isDateObject, minToMax, parseDate
} from './util';

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding
  },
  methods: Popper.methods,
  data() {
    return merge({ visibleArrow: false }, Popper.data());
  },
  beforeDestroy: Popper.beforeDestroy
};

const MULTI_SELECT_START_DATE = '2018-01-01'; // because 2018-01-01 starts on Monday

const DEFAULT_FORMATS = {
  date: 'dd MMMM yyyy',
  month: 'MMMM yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  timerange: 'HH:mm:ss',
  daterange: 'dd.MM.yyyy',
  daterangepredef: 'dd.MM.yyyy',
  year: 'yyyy'
};
const HAVE_TRIGGER_TYPES = [
  'date',
  'month',
  'year',
  'daterange',
  'daterangepredef',
  'multi',
  'oneday'
];
const DATE_FORMATTER = function (value, format) {
  return formatDate(value, format);
};
const DATE_PARSER = function (text, format) {
  return parseDate(text, format);
};
const RANGE_FORMATTER = function (value, format) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return [formatDate(start, format), formatDate(end, format)];
    }
  }
  return '';
};
const RANGE_PARSER = function (array, format, separator) {
  if (!Array.isArray(array)) {
    array = array.split(separator); // eslint-disable-line no-param-reassign
  }
  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];

    return [parseDate(range1, format), parseDate(range2, format)].sort(minToMax);
  }
  return [];
};
const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) return '';
      return `${value}`;
    },
    parser(text) {
      if (text === undefined || text === '') return null;
      return text;
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  daterangepredef: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  }
};
const PLACEMENT_MAP = {
  left: 'bottom-start',
  center: 'bottom',
  right: 'bottom-end'
};

const parseAsFormatAndType = (value, customFormat, type, rangeSeparator = '-') => {
  if (!value) return null;
  const parser = (
    TYPE_VALUE_RESOLVER_MAP[type]
      || TYPE_VALUE_RESOLVER_MAP.default
  ).parser;
  const format = customFormat || DEFAULT_FORMATS[type];
  return parser(value, format, rangeSeparator);
};

const formatAsFormatAndType = (value, customFormat, type) => {
  if (!value) return null;
  const formatter = (
    TYPE_VALUE_RESOLVER_MAP[type]
      || TYPE_VALUE_RESOLVER_MAP.default
  ).formatter;
  const format = customFormat || DEFAULT_FORMATS[type];
  return formatter(value, format);
};

const valueEquals = function (a, b) {
  const aIsArray = a instanceof Array;
  const bIsArray = b instanceof Array;
  if (aIsArray && bIsArray) {
    return a.length === b.length && a.every((av, index) => new Date(av).getTime() === new Date(b[index]).getTime());
  }
  if (!aIsArray && !bIsArray) {
    return new Date(a).getTime() === new Date(b).getTime();
  }
  return false;
};

const isString = function (val) {
  return typeof val === 'string' || val instanceof String;
};

const validator = function (val) {
  // either: String, Array of String, null / undefined
  return (
    val === null
      || val === undefined
      || isString(val)
      || (Array.isArray(val) && val.length === 2 && val.every(isString))
  );
};

export default {
  name: 'DatePicker',
  mixins: [HidePopper, NewPopper, Focus('reference')],

  inject: {
    elFormItem: {
      default: 'small'
    }
  },

  props: {
    type: String,
    size: {
      type: String,
      default: 'large'
    },
    format: String,
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: {
      type: String,
      default() {
        return t('el.datepicker.startPlaceholder');
      }
    },
    endPlaceholder: {
      type: String,
      default() {
        return t('el.datepicker.endPlaceholder');
      }
    },
    name: {
      default: '',
      validator
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: false
    },
    label: String,
    id: {
      default: '',
      validator
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: 'left'
    },
    modelValue: {},
    defaultValue: {},
    rangeSeparator: {
      default: '–'
    },
    pickerOptions: {},
    parseFormat: {
      type: Function,
      default: null
    }
  },

  components: {
    ElInput,
    ElIcon
  },

  directives: { Clickoutside },

  emits: ['blur', 'focus', 'change', 'update:modelValue'],

  data() {
    return {
      pickerVisible: false,
      showClose: false,
      userInput: null,
      valueOnOpen: [], // value when picker opens, used to determine whether to emit change
      unwatchPickerOptions: null,
      selectedDate: [],
      selectedDays: this.modelValue && this.type === 'multi' ? this.modelValue.filter((x) => !(typeof x === 'string')) : [],
      selectedCustomOptions: this.modelValue && this.type === 'multi' ? this.modelValue.filter((x) => typeof x === 'string') : []
    };
  },

  computed: {
    inputPlaceholder() {
      return (this.type === 'daterange' || this.type === 'daterangepredef')
        ? `${this.startPlaceholder} ${this.rangeSeparator} ${this.endPlaceholder}`
        : this.getPlaceholderText(this.type);
    },

    reference() {
      const reference = this.$refs.reference;
      if (reference.$refs && reference.$refs.container) {
        return reference.$refs.container;
      }
      return reference.$el || reference;
    },

    refInput() {
      if (this.reference) {
        return [].slice.call(this.reference.querySelectorAll('input'));
      }
      return [];
    },

    valueIsEmpty() {
      const val = this.modelValue;
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) {
            return false;
          }
        }
      } else if (val) {
        return false;
      }
      return true;
    },

    selectionMode() {
      if (this.type === 'month') {
        return 'month';
      }
      if (this.type === 'year') {
        return 'year';
      }
      if (this.type === 'multi') {
        return 'multi';
      }
      if (this.type === 'oneday') {
        return 'oneday';
      }
      return 'day';
    },

    haveTrigger() {
      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
    },

    displayValue() {
      const formattedValue = this.parseFormat
        ? this.parseFormat(this.parsedValue)
        : formatAsFormatAndType(this.parsedValue, this.format, this.type);
      if (this.type === 'multi') {
        if (this.pickerOptions
            && this.pickerOptions.customOptionSelectAll
            && this.selectedDays.length + this.selectedCustomOptions.length
              === (this.pickerOptions.customOptions ? this.pickerOptions.customOptions.length : 0) + 31
        ) {
          return this.pickerOptions.customOptionSelectAll;
        }
        if (this.selectedCustomOptions.length) {
          const labels = this.pickerOptions.customOptions.filter((x) => (
            this.selectedCustomOptions.indexOf(x.key) > -1
          ));
          return this.selectedDays.join(', ').concat(
            this.selectedDays.length ? ', ' : '',
            labels.map((x) => x.label).join(', ')
          );
        }
        return this.selectedDays.join(', ');
      }

      if (this.type === 'daterange' || this.type === 'daterangepredef') {
        const minDate = (formattedValue && formattedValue[0]) || '';
        const maxDate = (formattedValue && formattedValue[1]) || '';
        const formattedInput = minDate || maxDate ? `${minDate} ${this.rangeSeparator} ${maxDate}` : null;
        return this.userInput || formattedInput || '';
      }

      if (this.type === 'oneday') {
        if (Number(formattedValue)) {
          return Number(formattedValue);
        }
        if (isDate(formattedValue)) {
          return new Date(formattedValue).getDate();
        }

        if (this.customOptionKeys.includes(formattedValue)) {
          return this.pickerOptions.customOptions.find((option) => option.key === formattedValue).label;
        }
      }
      return this.userInput || formattedValue || '';
    },

    parsedValue() {
      const isValueArray = Array.isArray(this.modelValue);
      const isParsed = isDateObject(this.modelValue) || (isValueArray && this.modelValue.every(isDateObject));
      if (this.valueFormat && !isParsed && this.type !== 'multi') {
        return parseAsFormatAndType(this.modelValue, this.valueFormat, this.type, this.rangeSeparator)
              || this.modelValue;
      }
      if (this.type === 'multi' && isValueArray && !this.modelValue.every(isDateObject)) {
        return this.modelValue.map((x) => {
          if (typeof x === 'string') {
            return x;
          }
          return new Date(MULTI_SELECT_START_DATE.slice(0, -2) + `00${x < 1 ? 1 : x > 31
            ? 31
            : Math.floor(x)}`.slice(-2));
        });
      }
      return this.modelValue;
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    pickerSize() {
      return this.size || this._elFormItemSize;
    },

    customOptionKeys() {
      if (this.pickerOptions.customOptions) {
        return this.pickerOptions.customOptions.map((item) => item.key);
      }
      return [];
    }
  },

  watch: {
    pickerVisible(val) {
      this.showPopper = val;
      if (this.readonly || this.disabled) return;
      if (val) {
        this.showPicker();
        this.valueOnOpen = this.modelValue;
      } else {
        this.hidePicker();
        if (this.type !== 'multi') {
          this.emitChange(this.modelValue);
        }
        // flush user input if it is parsable
        // this.displayValue here is not a typo, it merges text for both panels in range mode
        const parsedValue = this.parseString(this.displayValue);
        if (this.userInput && parsedValue && this.isValidValue(parsedValue) && this.type !== 'multi') {
          this.userInput = null;
        }
      }
    },
    parsedValue: {
      immediate: true,
      handler(val) {
        if (this.picker) {
          if (this.type === 'multi') {
            this.picker.value = Array.isArray(val)
              ? val.filter((item) => item instanceof Date)
              : [];
          } else {
            this.picker.value = val;
          }
        }
        this.emitDisplayValue();
      }
    },
    defaultValue(val) {
      // NOTE: should eventually move to jsx style picker + panel ?
      if (this.picker) {
        this.picker.defaultValue = val;
      }
    },
    showPopper(val) {
      if (this.pickerVisible !== val) {
        this.pickerVisible = val;
      }
    }
  },

  created() {
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    };
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
    eventBus.$on('onHidePopper', this.handleClose);
  },

  mounted() {
    this.$nextTick(() => {
      this.emitDisplayValue();
    });
  },

  methods: {
    emitBlurEvents() {
      eventBus.$emit('el.form.blur');
      // this.dispatch('ElFormItem', 'el.form.blur');
      this.$emit('blur', this);
    },

    blur() {
      this.refInput.forEach((input) => input.blur());
      this.emitBlurEvents();
    },

    formatToValue(date) {
      const isFormattable = isDateObject(date) || (Array.isArray(date) && date.every(isDateObject));
      if (this.valueFormat && isFormattable) {
        return formatAsFormatAndType(date, this.valueFormat, this.type);
      }
      return date;
    },

    // {parse, formatTo} String deals with user input
    parseString(value) {
      return parseAsFormatAndType(value, this.format, this.type, this.rangeSeparator);
    },

    handleMouseEnter() {
      if (this.readonly || this.disabled) return;
      if (!this.valueIsEmpty && this.clearable) {
        this.showClose = true;
      }
    },

    handleChange() {
      if (this.userInput) {
        const value = this.parseString(this.displayValue);
        if (value) {
          this.picker.value = value;
          if (this.isValidValue(value)) {
            this.emitInput(value);
            this.userInput = null;
          }
        }
      }
    },

    handleClickIcon(event) {
      if (this.readonly || this.disabled) return;
      if (this.showClose) {
        event.stopPropagation();
        this.emitInput(null);
        this.emitChange(null);
        this.showClose = false;
        if (this.picker && typeof this.picker.handleClear === 'function') {
          this.picker.handleClear();
        }
      }
    },

    handleClose() {
      if (this.pickerVisible) {
        this.pickerVisible = false;
        this.emitBlurEvents();
      }
    },

    handleClick() {
      if (HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1 && !this.pickerVisible) {
        this.pickerVisible = true;
      }
    },

    handleFocus() {
      this.$emit('focus', this);
    },

    handleKeydown(event) {
      const keyCode = event.keyCode;

      // ESC
      if (keyCode === 27) {
        this.pickerVisible = false;
        this.blur();
        event.stopPropagation();
        return;
      }

      // Tab
      if (keyCode === 9) {
        this.handleChange();
        this.pickerVisible = false;
        this.emitBlurEvents();
        event.stopPropagation();
        return;
      }

      // Enter
      if (keyCode === 13) {
        if (this.type === 'multi') {
          if (!this.pickerVisible) {
            this.pickerVisible = true;
          } else {
            this.picker.$emit('multi', this.picker.value);
          }
          event.stopPropagation();
        } else {
          if (!this.pickerVisible) {
            this.pickerVisible = true;
          } else if (this.displayValue) {
            const value = this.parseString(this.displayValue);
            if (this.isValidValue(value)) {
              this.handleChange();
              this.pickerVisible = false;
              this.blur();
            }
          }
          event.stopPropagation();
        }
        return;
      }

      // arrow down
      if (keyCode === 40 && !this.pickerVisible) {
        this.pickerVisible = true;
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // if user is typing, do not let picker handle key input
      if (this.userInput) {
        event.stopPropagation();
        return;
      }

      // delegate other keys to panel
      if (this.picker && this.picker.handleKeydown) {
        this.picker.handleKeydown(event);
      }
    },

    hidePicker() {
      if (this.picker) {
        this.picker.resetView && this.picker.resetView();
        this.pickerVisible = this.picker.visible = false; // eslint-disable-line no-multi-assign
        this.destroyPopper();
      }
      if (this.type === 'multi') {
        this.selectedDate = [];
        if (this.picker) {
          this.picker.currentCustomOptions = this.selectedCustomOptions;
        }
      }
    },

    showPicker() {
      if (this.$isServer) return;
      if (!this.picker) {
        this.mountPicker();
      }
      this.pickerVisible = this.picker.visible = true; // eslint-disable-line no-multi-assign

      this.updatePopper();
      if (this.type === 'multi') {
        if (Array.isArray(this.parsedValue)) {
          this.selectedDate = this.parsedValue.filter((item) => item instanceof Date);
          this.selectedCustomOptions = this.parsedValue.filter((item) => typeof item === 'string');
        } else {
          this.selectedDate = [];
          this.selectedCustomOptions = [];
        }

        this.picker.multiValues = this.selectedDate;
      } else if (this.type === 'oneday') {
        if (this.parsedValue) {
          if (!isDateObject(this.parsedValue)) {
            if (this.customOptionKeys.includes(this.parsedValue)) {
              this.picker.value = this.parsedValue;
            } else {
              const date = new Date(MULTI_SELECT_START_DATE);
              this.picker.value = date.setDate(this.parsedValue);
            }
          } else {
            this.picker.value = this.parsedValue;
          }
        }
        if (this.customOptionKeys.includes(this.parsedValue)) {
          this.picker.currentCustomOptions = this.customOptionKeys;
        } else {
          this.picker.currentCustomOptions = [];
        }
      } else {
        this.picker.value = this.parsedValue;
      }
      this.picker.resetView && this.picker.resetView();
      this.$nextTick(() => {
        this.picker.adjustSpinners && this.picker.adjustSpinners();
      });
    },

    mountPicker() {
      this.picker = createApp(defineComponent({
        ...this.panel,
        props: {
          vOnDodestroy: this.doDestroy,
          vOnPick: this.handlePick,
          vOnPickOneday: this.handlePickOneDay,
        },
        parentElement: this
      })).mount(document.createElement('div'));
      // document.createElement('div')
      // console.log(this.picker)
      this.picker.defaultValue = (this.type === 'multi' || this.type === 'oneday') ? MULTI_SELECT_START_DATE : this.defaultValue;
      if (this.type === 'multi') {
        this.picker.currentCustomOptions = this.selectedCustomOptions;
      } else {
        this.picker.currentCustomOptions = [];
      }
      this.picker.popperClass = this.popperClass;
      this.popperElm = this.picker.$el;
      this.picker.width = this.reference.getBoundingClientRect().width;
      this.picker.selectionMode = this.selectionMode;
      this.picker.arrowControl = this.arrowControl || false;
      this.picker.predefined = this.type === 'daterangepredef';
      if (this.pickerOptions && this.picker.predefined) {
        this.picker.predefinedSettings = this.pickerOptions.settings;
      }
      if (this.format) {
        this.picker.format = this.format;
      }

      const updateOptions = () => {
        const options = this.pickerOptions;

        // eslint-disable-next-line no-restricted-syntax
        for (const option in options) {
          if (options.hasOwnProperty(option)) {
            this.picker[option] = options[option];
          }
        }
      };
      updateOptions();
      this.unwatchPickerOptions = this.$watch('pickerOptions', () => updateOptions(), { deep: true });

      this.$el.appendChild(this.picker.$el);
      this.picker.resetView && this.picker.resetView();

      // this.picker.$on('dodestroy', this.doDestroy);
      // this.picker.$on('pick', (date = '', visible = false) => {
      //   this.userInput = null;
      //   this.pickerVisible = this.picker.visible = visible; // eslint-disable-line no-multi-assign
      //   this.emitInput(date);
      //   this.picker.resetView && this.picker.resetView();
      // });

      // this.picker.$on('pick-oneday', () => {
      //   this.$nextTick(() => {
      //     this.emitChange(this.picker.value);
      //     this.emitInput(this.picker.value);
      //     this.pickerVisible = false;
      //     this.blur();
      //   });
      // });

      // this.picker.$on('pick-multi', (date = '') => {
      //   if (date !== null) {
      //     this.picker.value = date;
      //   }
      // });
      //
      // this.picker.$on('multi', (date = '') => {
      //   const selected = new Date(date);
      //
      //   if (date === null) {
      //     this.selectedDate = [];
      //     this.userInput = '';
      //     this.picker.multiValues = this.selectedDate;
      //     return;
      //   }
      //
      //   let existIndex = -1;
      //   this.selectedDate.some((day, index) => {
      //     if (day.getDate && day.getDate() === selected.getDate()) {
      //       existIndex = index;
      //       return true;
      //     }
      //     return false;
      //   });
      //   if (existIndex > -1) {
      //     this.selectedDate = [...this.selectedDate.slice(0, existIndex), ...this.selectedDate.slice(existIndex + 1)];
      //   } else {
      //     this.selectedDate = this.selectedDate.concat([selected]);
      //   }
      //
      //   this.selectedDate.sort(function (a, b) {
      //     return new Date(a).getDate() - new Date(b).getDate();
      //   });
      //
      //   this.picker.multiValues = this.selectedDate;
      // });
      //
      // this.picker.$on('select-all', () => {
      //   const startDate = new Date(MULTI_SELECT_START_DATE);
      //   const allDays = [];
      //   allDays.push(new Date(MULTI_SELECT_START_DATE));
      //   for (let n = 0; n < 30; n++) {
      //     allDays.push(new Date(startDate.setDate(startDate.getDate() + 1)));
      //   }
      //   this.selectedDate = allDays;
      //   this.picker.multiValues = this.selectedDate;
      // });
      //
      // this.picker.$on('apply-multi', () => {
      //   this.$nextTick(() => {
      //     this.selectedDays = this.selectedDate.map((item) => (new Date(item).getDate()));
      //     let selectedItems = this.selectedDays;
      //     if (this.type === 'multi' && this.pickerOptions && this.pickerOptions.customOptions) {
      //       this.selectedCustomOptions.sort((a, b) => this.customOptionKeys.indexOf(a)
      //         - this.customOptionKeys.indexOf(b));
      //       selectedItems = this.selectedDays.concat(this.selectedCustomOptions);
      //     }
      //     this.emitChange(selectedItems);
      //     this.emitInput(selectedItems);
      //     this.pickerVisible = false;
      //     this.blur();
      //   });
      // });
      //
      // this.picker.$on('update-custom-options', (options) => {
      //   this.selectedCustomOptions = options;
      //   this.picker.multiValues = this.selectedDate;
      // });
    },

    unmountPicker() {
      /* istanbul ignore else */
      if (this.picker) {
        // this.picker.$unmount();
        // this.picker.$off();
        /* istanbul ignore else */
        if (typeof this.unwatchPickerOptions === 'function') {
          this.unwatchPickerOptions();
        }
        this.picker.$el.parentNode.removeChild(this.picker.$el);
      }
    },

    emitChange(val) {
      this.$emit('change', val);
      eventBus.$emit('el.form.change', val);
      // this.dispatch('ElFormItem', 'el.form.change', val);
      this.valueOnOpen = val;
    },

    emitInput(val) {
      const formatted = this.formatToValue(val);
      if (!valueEquals(this.modelValue, formatted)) {
        this.$emit('update:modelValue', formatted);
        eventBus.$emit('el.form.input', val);
        // this.dispatch('ElFormItem', 'el.form.input', val);
      }
    },

    emitDisplayValue() {
      if (!this.$parent
          || !this.elFormItem.$options
          || this.$parent.$options.name !== this.elFormItem.$options.name) {
        return;
      }
      const displayValue = {};
      displayValue[this.elFormItem.prop] = this.displayValue;
      eventBus.$emit('el.multisearch.displayValue', displayValue);
      // this.dispatch('ElMultiSearch', 'display-value', displayValue);
    },

    isValidValue(value) {
      /* istanbul ignore if */
      if (!this.picker) {
        this.mountPicker();
      }
      if (this.picker.isValidValue) {
        return value && this.picker.isValidValue(value);
      }
      return true;
    },

    getPlaceholderText(type) {
      if (this.placeholder) return this.placeholder;

      switch (type) {
        case 'multi':
          return t('el.datepicker.pickMulti');
        case 'year':
          return t('el.datepicker.pickAYear');
        case 'month':
          return t('el.datepicker.pickAMonth');
        case 'date':
        default:
          return t('el.datepicker.pickADay');
      }
    },

    handlePick(date = '', visible = false) {
      console.log('handlePick');
      this.userInput = null;
      this.pickerVisible = this.picker.visible = visible; // eslint-disable-line no-multi-assign
      this.emitInput(date);
      this.picker.resetView && this.picker.resetView();
    },

    async handlePickOneDay() {
      console.log('handlePickOneDay');
      await nextTick();
      this.emitChange(this.picker.value);
      this.emitInput(this.picker.value);
      this.pickerVisible = false;
      this.blur();
    },
  }
};
</script>
