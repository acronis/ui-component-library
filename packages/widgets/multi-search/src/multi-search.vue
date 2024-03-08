<template>
  <div class="el-multi-search">
    <el-filter
      v-show="!hideFilter"
      ref="filter"
      v-model="value.filters"
      class="ml-16"
      :form-rules="formRules"
      :apply-callback="handleApplyClick"
      :defaults="filterDefaults"
    >
      <template #default="{ filters }">
        <slot :filters="filters" />
      </template>
    </el-filter>
    <el-button
      v-if="!searchOpened"
      :class="{
        'ml-16': hideFilter,
        'ml-8': !hideFilter
      }"
      class="el-multi-search__search-button"
      type="ghost"
      icon="i-search-o--16"
      @click="handleOpenClick"
    >
      {{ t('el.multi-search.search-button') }}
    </el-button>
    <el-search
      v-else
      ref="search"
      v-model="searchModel"
      class="el-multi-search__search"
      :class="{
        'ml-24': hideFilter,
        'ml-16': !hideFilter
      }"
      :placeholder="placeholder || t('el.multi-search.search-placeholder')"
      @click="handleSearchClick"
      @update:model-value="handleInput"
      @keydown="handleKeyDown"
    />
  </div>
</template>


<script>
import Locale from '@/mixins/locale';
import eventBus from '@/utils/eventBus';

export default {
  name: 'ElMultiSearch',
  mixins: [Locale],
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        filters: [],
        search: ''
      }),
      required: true
    },
    filterDefaults: { // has the same structure as `modelValue.filters` property
      type: Object
    },
    hideFilter: {
      type: Boolean,
      default: false
    },
    applyCallback: {
      type: Function,
      default: (done) => { done(); }
    },
    formRules: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data: () => ({
    searchOpened: false,
    inputElm: null,
    separator: ';',
    labelToDisplayValueMap: {},
    displayValueToLabelMap: {},
    searchModel: '',
    value: this.modelValue
  }),
  computed: {
    filterSeparator() {
      return ` ${this.t('el.multi-search.separator-and')} `;
    },
    filters() {
      if (this.searchModel.indexOf(this.filterSeparator) > -1) {
        return this.searchModel.split(this.filterSeparator)[0];
      }
      return '';
    }
  },
  watch: {
    'value.search': function () {
      this.updateSearchValue();
    }
  },
  created() {
    eventBus.$on('el.multisearch.displayValue', this.handleDisplayValue);
    eventBus.$on('el.multisearch.input.mount', (input) => {
      this.inputElm = input;
    });
  },
  async mounted() {
    if (this.$refs.filter.filtersCount || this.modelValue.search) {
      await this.openSearch();
    }
  },
  methods: {
    handleDisplayValue(value) {
      Object.assign(this.labelToDisplayValueMap, value);
      this.displayValueToLabelMap = Object.keys(this.labelToDisplayValueMap).reduce((accum, key) => {
        accum[this.labelToDisplayValueMap[key]] = key;
        return accum;
      }, {});
      if (this.$refs.filter && this.$refs.filter.status !== 'editing') {
        this.updateSearchValue();
      }
    },
    handleClear() {
      this.$refs.filter.handleResetClick();
      this.labelToDisplayValueMap = {};
      this.$emit('update:modelValue', { filters: this.$refs.filter.filters, search: '' });
      this.value.search = '';
    },
    handleApplyClick(done) {
      this.$emit('update:modelValue', {
        filters: this.value.filters,
        search: this.searchModel.includes(this.filterSeparator)
          ? this.searchModel.split(this.filterSeparator)[1]
          : this.searchModel
      });
      this.applyCallback(done);
      this.openSearch();
      this.updateSearchValue();
    },
    async handleOpenClick() {
      await this.openSearch();
      this.$refs.search.focus();
    },
    async openSearch() {
      this.searchOpened = true;
      await this.$nextTick();
    },
    handleKeyDown(event) {
      if (this.filters && this.inputElm.selectionEnd <= this.filters.length) {
        let word;
        let position;
        switch (event.key) {
          case 'ArrowRight':
          case 'Right':
            if (this.inputElm.selectionEnd === this.filters.length) {
              const newPosition = this.filters.length + this.filterSeparator.length - 1;
              this.inputElm.setSelectionRange(newPosition, newPosition);
            } else {
              event.preventDefault();
              this.highlightWordByPosition(this.inputElm.selectionEnd + 2);
            }
            break;
          case 'ArrowLeft':
          case 'Left':
            event.preventDefault();
            this.highlightWordByPosition(this.inputElm.selectionStart - 2);
            break;
          case 'Backspace':
          case 'Delete':
          case 'Del':
            event.preventDefault();
            position = this.inputElm.selectionStart;
            word = this.getWordByPosition(position + 1);
            this.searchModel = this.replaceByPosition(this.searchModel, position + 1);
            this.removeFilter(word);
            this.$nextTick(() => {
              this.removeUselessCharacters();
              if (event.key === 'Backspace') {
                this.highlightWordByPosition(position - 2);
              } else {
                this.highlightWordByPosition(position + 1);
              }
              this.handleInput(this.searchModel);
            });
            break;
          default:
            event.preventDefault();
            break;
        }
      } else if (
        this.filters
          && this.inputElm.selectionEnd > this.filters.length
          && this.inputElm.selectionEnd <= this.filters.length + this.filterSeparator.length
          && (event.key === 'ArrowLeft' || event.key === 'Backspace' || event.key === 'Left')) {
        event.preventDefault();
        this.highlightWordByPosition(this.filters.length - 1);
      }
    },
    handleInput(value) {
      if (!value) {
        this.handleClear();
      } else if (value.indexOf(this.filterSeparator.trimEnd()) === -1) {
        this.$emit('update:modelValue', Object.assign(this.value, { search: value }));
      } else {
        this.$emit('update:modelValue', Object.assign(this.value, { search: value.split(this.filterSeparator)[1] || '' }));
      }

      this.applyCallback(() => {});
    },
    handleSearchClick() {
      if (this.isHighlightable(this.filters)) {
        this.highlightWordByPosition(this.inputElm.selectionEnd);
      }
      if (this.filters
          && this.inputElm.selectionEnd > this.filters.length
          && this.inputElm.selectionEnd < this.filters.length + this.filterSeparator.length) {
        const newPosition = this.filters.length + this.filterSeparator.length;
        this.inputElm.setSelectionRange(newPosition, newPosition);
      }
    },
    removeUselessCharacters() {
      const sep = this.separator;
      this.searchModel = this.searchModel.replace(`${sep} ${sep} `, `${sep} `);
      this.searchModel = this.searchModel.replace(`${sep} ${sep}`, `${sep} `);
      this.searchModel = this.searchModel.replace(`${sep}  `, ' ');
      this.searchModel = this.searchModel.replace(` ${sep} `, `${sep} `);
      this.searchModel = this.searchModel.replace(new RegExp(`^\\s*${this.filterSeparator}\\s*`, 'g'), '');
      this.searchModel = this.searchModel.replace(new RegExp(`^${sep} `, 'g'), '');
      this.searchModel = this.searchModel.replace(/^\s*/g, '');
      this.searchModel = this.searchModel.replace(new RegExp(`${sep}'\\s*${this.filterSeparator}`, 'g'), `${this.filterSeparator}`);
      this.searchModel = this.searchModel.replace(new RegExp(`\\s*${this.filterSeparator}`, 'g'), `${this.filterSeparator}`);
    },
    removeFilter(displayValue) {
      const oldValue = this.value.filters[this.displayValueToLabelMap[displayValue]];

      if (typeof oldValue === 'boolean') {
        this.value.filters[this.displayValueToLabelMap[displayValue]] = false;
      } else if (typeof oldValue === 'string') {
        this.value.filters[this.displayValueToLabelMap[displayValue]] = '';
      } else if (typeof oldValue === 'number') {
        this.value.filters[this.displayValueToLabelMap[displayValue]] = null;
      } else if (this.isDate(oldValue)) {
        if (Array.isArray(oldValue)) {
          this.value.filters[this.displayValueToLabelMap[displayValue]] = [];
        } else {
          this.value.filters[this.displayValueToLabelMap[displayValue]] = null;
        }
      } else if ((Array.isArray(oldValue) || oldValue === undefined) && !this.isDate(oldValue)) {
        let label;
        Object.keys(this.displayValueToLabelMap).some((item) => {
          if (item.indexOf(displayValue) > -1) {
            label = this.displayValueToLabelMap[item];
            return true;
          }
          return false;
        });
        const index = this.labelToDisplayValueMap[label].split(`${this.separator} `).indexOf(displayValue);
        this.value.filters[label].splice(index, 1);
        return;
      }

      const label = this.displayValueToLabelMap[displayValue];
      delete this.displayValueToLabelMap[displayValue];
      delete this.labelToDisplayValueMap[label];
    },
    updateSearchValue() {
      this.$nextTick(() => {
        const filterValues = Object.values(this.labelToDisplayValueMap)
          .filter((v) => v !== '').join(`${this.separator} `);
        this.searchModel = filterValues !== ''
          ? (filterValues + this.filterSeparator + this.value.search) : this.value.search;
        this.removeUselessCharacters();
      });
    },
    getPositions(position) {
      let secondPosition = this.searchModel.indexOf(`${this.separator} `, position);
      if (secondPosition === -1) {
        secondPosition = this.searchModel.indexOf(this.filterSeparator, position);
      }
      if (secondPosition === -1) {
        secondPosition = this.filters.length;
      }
      let firstPosition = 0;
      for (let i = secondPosition; i > 0; i--) {
        if (this.searchModel[i] === ' ' && this.searchModel[i - 1] === this.separator) {
          firstPosition = i + 1;
          break;
        }
      }

      return { firstPosition, secondPosition };
    },
    getWordByPosition(position) {
      const positions = this.getPositions(position);
      return this.searchModel.substring(positions.firstPosition, positions.secondPosition);
    },
    highlightWordByPosition(position) {
      this.inputElm.setSelectionRange(0, 0);
      const positions = this.getPositions(position);

      this.$nextTick(() => {
        this.inputElm.setSelectionRange(positions.firstPosition, positions.secondPosition);
      });
    },
    replaceByPosition(query, position) {
      this.inputElm.setSelectionRange(0, 0);
      const positions = this.getPositions(position);

      return query.substring(0, positions.firstPosition) + query.substring(positions.secondPosition, query.length);
    },
    isHighlightable(filters) {
      return this.inputElm.selectionEnd <= filters.length
          && this.inputElm.selectionStart <= filters.length;
    },
    isDate(value) {
      if (Array.isArray(value) && value.length) {
        return value[0] instanceof Date && !isNaN(value[0]);
      }
      if (!Array.isArray(value)) {
        return value instanceof Date && !isNaN(value);
      }
    }
  }
};
</script>
