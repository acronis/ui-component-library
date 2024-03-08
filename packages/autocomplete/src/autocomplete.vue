<template>
  <div
    ref="autocomplete"
    v-clickoutside="close"
    class="el-autocomplete"
    aria-haspopup="listbox"
    role="combobox"
    :aria-expanded="suggestionVisible"
    :aria-owns="autocompleteId"
    :class="{'is-opened': suggestionVisible && !separateSuggestions}"
  >
    <el-input
      v-bind="$props"
      ref="input"
      :label="label"
      :embedded="embedded"
      :clearable="showClear"
      :maxlength="maxlength"
      :model-value="modelValue"
      @update:model-value="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.up.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter="handleKeyEnter"
      @keydown.tab="close"
      @clear="handleClear"
    >
      <template
        v-if="$slots.prepend"
        #prepend
      >
        <slot name="prepend" />
      </template>
      <template
        v-if="$slots.append"
        #append
      >
        <slot name="append" />
      </template>
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
      <template #suffix>
        <slot name="suffix">
          <el-spinner
            v-if="loading && modelValue"
          />
        </slot>
      </template>
    </el-input>
    <el-autocomplete-suggestions
      v-if="!disableSuggestions"
      :id="autocompleteId"
      ref="suggestions"
      :class="popperClass"
      :visible="suggestionVisible"
      placement="bottom"
    >
      <li
        v-for="(item, index) in suggestions"
        :id="`${autocompleteId}-item-${index}`"
        :key="index"
        :class="{'highlighted': highlightedIndex === index}"
        role="option"
        :aria-selected="highlightedIndex === index"
        @click="select(item)"
      >
        <slot :item="item">
          {{ item[valueKey] }}
        </slot>
      </li>
      <div
        v-if="!isValidData"
        class="el-autocomplete-suggestion__no-data"
      >
        <span class="el-text el-text--body-32 el-text--color-fixed-light">{{ noDataMessage }}</span>
      </div>
    </el-autocomplete-suggestions>
  </div>
</template>
<script>
import { debounce } from 'throttle-debounce';

import ElInput from 'packages/input';
import ElSpinner from 'packages/spinner';
import Focus from '@/mixins/focus';
import { t } from '@/locale';
import Clickoutside from '@/utils/clickoutside';
import { generateId } from '@/utils/util';

import ElAutocompleteSuggestions from './autocomplete-suggestions.vue';

export default {
  name: 'ElAutocomplete',

  components: {
    ElInput,
    ElSpinner,
    ElAutocompleteSuggestions
  },

  directives: { Clickoutside },

  mixins: [Focus('input')],

  props: {
    valueKey: {
      type: String,
      default: 'value'
    },
    noDataMessage: {
      type: String,
      default() {
        return t('el.autocomplete.noDataMessage');
      }
    },
    popperClass: [String, Object],
    separateSuggestions: Boolean,
    placeholder: {
      type: String,
      default() {
        return t('el.autocomplete.placeholder');
      }
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    disableSuggestions: Boolean,
    embedded: Boolean,
    maxlength: Number,
    name: String,
    size: String,
    modelValue: String,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: true
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    id: String,
    debounce: {
      type: Number,
      default: 500
    }
  },
  emits: ['update:modelValue', 'focus', 'blur', 'select', 'clear'],
  data() {
    return {
      autocompleteId: 'autocompleteId',
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      isValidData: false
    };
  },
  computed: {
    suggestionVisible() {
      return this.activated && !this.loading && this.modelValue && !this.disableSuggestions;
    },
    showClear() {
      if (this.clearable) {
        return this.modelValue && !this.loading;
      }
      return false;
    }
  },
  watch: {
    suggestions(value) {
      this.isValidData = Array.isArray(value) && value.length > 0;
    }
  },
  mounted() {
    this.debouncedGetData = debounce(this.debounce, (val) => {
      this.getData(val);
    });
    this.autocompleteId = this.getAutocompleteId();
    const $input = this.$el.querySelector('.el-input__container');
    $input.setAttribute('role', 'textbox');
    $input.setAttribute('aria-autocomplete', 'list');
    $input.setAttribute('aria-controls', 'id');
    $input.setAttribute('aria-activedescendant', `${this.autocompleteId}-item-${this.highlightedIndex}`);
  },
  methods: {
    handleClear() {
      this.$emit('clear');
    },
    getData(queryString) {
      if (!queryString || this.disableSuggestions) {
        this.loading = false;
        return;
      }
      this.loading = true;
      this.fetchSuggestions(queryString, (suggestions) => {
        this.loading = false;
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
        }
      });
    },
    handleChange(value) {
      this.loading = !this.disableSuggestions;
      this.$emit('update:modelValue', value);
      if (!this.triggerOnFocus && !value) {
        this.suggestions = [];
        return;
      }
      this.debouncedGetData(value);
      this.activated = true;
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    handleBlur(event) {
      this.$emit('blur', event);
    },
    close() {
      this.activated = false;
    },
    handleKeyEnter(e) {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        this.$refs.suggestions.$el.style.display = 'none';
        e.preventDefault();
        this.select(this.suggestions[this.highlightedIndex]);
      } else if (this.selectWhenUnmatched) {
        this.$emit('select', { value: this.modelValue });
        this.activated = false;
        this.$nextTick(() => {
          this.suggestions = [];
          this.highlightedIndex = -1;
        });
      }
    },
    select(item) {
      this.$emit('update:modelValue', item[this.valueKey]);
      this.$emit('select', item);
      this.$nextTick(() => {
        this.$refs.suggestions.$el.style.display = 'none';
        this.close();
        this.suggestions = [];
        this.highlightedIndex = -1;
      });
    },
    highlight(index) {
      if (!this.suggestionVisible || this.loading) { return; }
      if (index < 0) {
        this.highlightedIndex = -1;
        return;
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1; // eslint-disable-line no-param-reassign
      }

      this.highlightedIndex = index;
      this.$el.querySelector('.el-input__container').setAttribute('aria-activedescendant', `${this.autocompleteId}-item-${this.highlightedIndex}`);
    },
    getAutocompleteId() {
      return this.id || `el-autocomplete-${generateId()}`;
    }
  }
};
</script>
