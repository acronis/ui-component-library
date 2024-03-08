<template>
  <section
    v-clickoutside="handleBlur"
    class="el-search qa-search"
    :class="[
      {'el-search--large': type === 'embedded-large'},
      {'el-search--embedded': type === 'embedded' || type === 'embedded-large' && !isCollapsed},
      {'el-search--collapse-hover': type === 'embedded-large' && isCollapsed}
    ]"
    @keydown="handleKeydown"
  >
    <el-autocomplete
      v-if="type !== 'embedded-large' || (type === 'embedded-large' && !isCollapsed) || modelValue"
      v-bind="$props"
      ref="autocomplete"
      size="small"
      :model-value="currentValue"
      :embedded="embedded"
      :popper-class="{
        'el-search__suggestions': true,
        [suggestionsClass]: !!suggestionsClass
      }"
      separate-suggestions
      :no-data-message="noDataMessage"
      :disable-suggestions="!autocomplete"
      :maxlength="searchMaxlength"
      @select="handleSelect"
      @update:model-value="handleInput"
      @keydown.tab="handleBlur"
      @clear="handleClear"
    >
      <template #suffix>
        <el-icon
          v-if="!currentValue"
          color="brand-primary"
          :name="expanded ? 'i-times--16' : 'i-search-o--16'"
          :style="expanded ? {cursor: 'pointer'} : null"
          @click="isCollapsed = true"
        />
      </template>
    </el-autocomplete>

    <el-icon
      v-else
      :class="[
        'el-search__icon',
        'qa-search-icon',
        {'el-search__icon--large': type === 'embedded-large'},
        {'el-search__icon--collapsed': type === 'embedded-large' && isCollapsed},
      ]"
      color="brand-primary"
      name="i-search-o--24"
      tabindex="0"
      @click="isCollapsed = false"
      @keydown.enter="isCollapsed = false"
    />
  </section>
</template>

<script>
import ElIcon from 'packages/icon';
import { t } from '@/locale/I18n';
import Clickoutside from '@/utils/clickoutside';

let ElAutocomplete;

export default {
  name: 'ElSearch',

  components: {
    ElIcon,
    ElAutocomplete
  },

  directives: { Clickoutside },

  props: {
    autocomplete: {
      type: Boolean,
      default: false
    },
    fetchSuggestions: {
      type: Function,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    modelValue: {
      type: String,
      default: ''
    },
    noDataMessage: {
      type: String,
      default() {
        return t('el.search.noDataMessage');
      }
    },
    suggestionsClass: {
      type: String
    },
    maxlength: {
      type: Number
    }
  },

  data() {
    return {
      currentValue: this.modelValue,
      isCollapsed: !this.modelValue
    };
  },

  beforeMount() {
    import('packages/autocomplete').then((module) => {
      ElAutocomplete = module.default;
    });
  },

  computed: {
    embedded() {
      return this.type !== 'default';
    },
    expanded() {
      return this.type === 'embedded-large' && !this.isCollapsed;
    },
    searchMaxlength() {
      return this.maxlength > 0 ? this.maxlength : null;
    }
  },

  watch: {
    isCollapsed(val) {
      if (!val) {
        this.$nextTick(() => { this.$refs.autocomplete.focus(); });
      }
      this.$emit('search-collapse', val);
    },
    value(value) {
      this.currentValue = value;
    }
  },

  methods: {
    handleClear() {
      this.$emit('clear');
    },
    handleInput(value) {
      this.currentValue = value;
      if (this.type !== 'default') {
        this.changeValue(value);
        this.$emit('update:modelValue', value);
        return;
      }
      this.$emit('update:modelValue', value);
    },

    handleSelect(value) {
      this.$emit('select', value);
    },

    handleBlur() {
      if (this.type === 'embedded-large' && !this.currentValue) {
        this.isCollapsed = true;
      }
    },

    handleKeydown(event) {
      const keyCode = event.keyCode;

      if (keyCode === 13) {
        this.$emit('done');
      }
    },

    changeValue(value) {
      this.currentValue = value;
      if (!value) {
        this.$emit('clear');
        this.$emit('update:modelValue', value);
      }
    },

    focus() {
      this.$nextTick(() => { this.$refs.autocomplete.focus(); });
    },

    blur() {
      this.$nextTick(() => { this.$refs.autocomplete.blur(); });
    }
  }
};
</script>
