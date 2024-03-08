<template>
  <ClientOnly>
  <div
    v-clickoutside="preventHideOnClick ? handlePreventHideOnClick : handleClose"
    :class="[
      'el-select',
      'qa-select',
      selectSize ? 'el-select--' + selectSize : '',
      translucent ? 'el-select--translucent' : ''
    ]"
  >
    <template v-if="withTree">
      <el-input
        :id="id"
        ref="reference"

        :disabled="disabled"
        :name="name"
        :label="label"
        :readonly="readonly"
        :model-value="computedLabel"
        :title="computedTitle"
        :type="type"
        :placeholder="currentPlaceholder"
        :size="selectSize"
        :validate-event="false"
        :class="{
          'is-focus': visible,
          'qa-select-input': true
        }"
        :prefix-icon="selectedIcon || selectedPlaceholderIcon"
        :icon-color="selectedIconColor || selectedPlaceholderIconColor"
        @click="!openOnIconClick && handleClick($event)"
        @focus="handleFocus"
        @blur="handleBlur"
        @update:model-value="handleInput"
        @keydown="focusOnTree"
        @keydown.down.stop.prevent="navigateOptions('next')"
        @keydown.up.stop.prevent="navigateOptions('prev')"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.tab="handleTab"
      >
        <template #suffix>
          <el-icon
            :name="iconClass"
            :class="['el-select__caret', 'el-input__icon']"
            @click="openOnIconClick && handleClick($event)"
          />
        </template>
      </el-input>
    </template>
    <template v-else>
      <el-input
        :id="id"
        ref="reference"

        :type="type"
        :disabled="disabled"
        :name="name"
        :label="label"
        :readonly="readonly"
        :model-value="computedLabel"
        :title="computedTitle"
        :placeholder="currentPlaceholder"
        :size="selectSize"
        :validate-event="false"
        :class="{
          'is-focus': visible,
          'qa-select-input': true
        }"
        :prefix-icon="selectedIcon || selectedPlaceholderIcon"
        :icon-color="selectedIconColor || selectedPlaceholderIconColor"
        @click="!openOnIconClick && handleClick($event)"
        @focus="handleFocus"
        @blur="handleBlur"
        @update:model-value="handleInput"
        @keydown.down.stop.prevent="navigateOptions('next')"
        @keydown.up.stop.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.tab="handleTab"
      >
        <template
          v-if="!!$slots.prefix"
          #selectPrefix
        >
          <slot name="prefix" />
        </template>
        <template
          v-if="!!$slots.selectSuffix"
          #selectSuffix
        >
          <slot name="selectSuffix" />
        </template>
        <template
          #suffix
        >
          <!-- @slot suffix slot to render the icon content after select input -->
          <slot name="suffix">
            <el-icon
              :name="iconClass"
              :class="['el-select__caret', 'el-input__icon', 'qa-select-icon']"
              @click="openOnIconClick && handleClick($event)"
            />
          </slot>
        </template>
      </el-input>
    </template>

    <transition
      name="el-zoom-in-top"
      @before-enter="handleDropdownEnter"
    >
      <el-select-dropdown
        v-if="showDropdown || visible || selectDropdownMounted || !flyweight"
        ref="popper"
        :visible="showDropdown || visible"
        :filterable="filterable"
        :search-placeholder="searchPlaceholder"
        :placement="popperPlacement"
        :max-width="popperMaxWidth"
        :dynamic-width="dynamicWidth"
        @searchedit="onSearchEdit"
        @keydown.down.stop.prevent="navigateOptions('next')"
        @keydown.up.stop.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.tab="handleTab"
      >
        <el-scrollbar
          v-show="isOptionsSectionShown"
          ref="scrollbar"
          tag="ul"
          :wrap-style="`max-height: ${popperMaxHeight};`"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :dropdown="true"
          :class="{ 'is-empty': query && filteredOptionsCount === 0 }"
          @scroll="handleDropdownScroll"
        >
          <div
            v-if="multiple && selectAll"
            v-show="!query"
          >
            <el-option
              :key="selectAllValue"
              :value="selectAllValue"
              :label="selectAllLabel"
              @click.stop.prevent="handleAllClick"
            />
            <el-divider class="my-8" />
          </div>
          <div v-if="isRemoteSelectedSectionShown">
            <el-option
              v-for="item in previousSelected"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :icon="item.icon"
              :icon-color="item.iconColor"
              :force-visible="true"
            />
            <el-divider
              v-show="isDividerShown"
              class="my-8"
            />
          </div>
          <div
            v-if="isRemoteSearchResultsCountShown"
            class="el-select-dropdown__search-count el-text el-text--body-24"
          >
            {{ computedRemoteSearchResultsCount }}
          </div>
          <!-- @slot Default slot to render the contents to show inside the select input -->
          <slot v-if="!isLoadingShown" />
          <div
            v-if="scrollLoading && !isLoadingShown"
            class="el-select-dropdown__scroll-loading"
          >
            <el-spinner
              color="brand-primary"
              class="mr-8"
            />
          </div>
          <div
            v-if="emptyText && !remoteSearchResultsCount &&
              !withTree"
            class="el-select-dropdown__empty"
          >
            {{ emptyText }}
          </div>
        </el-scrollbar>
        <div
          v-if="isLoadingShown"
          v-loading="isLoadingShown"
          class="el-select__loading"
          el-loading-size="24"
        />
      </el-select-dropdown>
    </transition>
  </div>
</ClientOnly>
</template>
<script>
import { debounce } from 'throttle-debounce';

import ElDivider from 'packages/divider';
import ElIcon from 'packages/icon';
import ElInput from 'packages/input';
import Loading from 'packages/loading/src/directive';
import ElScrollbar from 'packages/scrollbar';
import ElSpinner from 'packages/spinner';
import Focus from '@/mixins/focus';
import Locale from '@/mixins/locale';
import { t } from '@/locale';
import Clickoutside from '@/utils/clickoutside';
import eventBus from '@/utils/eventBus';
import scrollIntoView from '@/utils/scroll-into-view';
import { isEqual, isObjectLike, valueEquals } from '@/utils/util';

import NavigationMixin from './navigation-mixin';
import ElOption from './option.vue';
import ElSelectDropdown from './select-dropdown.vue';

const defaultOptionHeight = 40; // height of an option
const sizeMap = {
  medium: 36,
  small: 32
};

export default {
  name: 'ElSelect',

  components: {
    ElIcon,
    ElInput,
    ElSelectDropdown,
    ElOption,
    ElScrollbar,
    ElDivider,
    ElSpinner
  },

  directives: {
    loading: Loading,
    Clickoutside
  },

  mixins: [Locale, Focus('reference'), NavigationMixin],

  componentName: 'ElSelect',

  inject: {
    elFormItem: {
      default: ''
    }
  },

  provide() {
    return {
      select: this
    };
  },

  props: {
    /**
       * the name attribute of select input
       */
    name: String,
    /**
       * the id attribute of select input
       */
    id: String,
    /**
       * the value attribute of select input
       */
    modelValue: {
      required: true
    },
    /**
       * the size attribute of select input
       */
    size: String,
    /**
       * whether select is disabled
       */
    disabled: Boolean,
    /**
       * whether single select can be cleared
       */
    clearable: Boolean,
    /**
       * Custom text displayed in select input
       */
    customText: String,
    /**
       * Custom hint message
       */
    customHint: String,
    /**
       * whether select is filterable
       */
    filterable: Boolean,
    /**
       * whether select is loading data from server
       */
    loading: Boolean,
    /**
       * whether select is loading infinite scrolling data from server
       */
    scrollLoading: {
      type: Boolean,
      default: false
    },
    /**
       * whether search result reach the end of scroll and `remote-scroll-method` will not be called
       */
    isScrollEnd: {
      type: Boolean,
      default: true
    },
    /**
       * custom class name for select's dropdown
       */
    popperClass: String,
    /**
       * placement of select's dropdown
       */
    popperPlacement: {
      type: String,
      default: 'bottom-start'
    },
    /**
       * open dropdown only by icon click
       */
    openOnIconClick: Boolean,
    /**
       * close dropdown when scroll the window
       */
    hideOnScroll: Boolean,
    /**
       * dynamic width of dropdown
       */
    dynamicWidth: Boolean,
    /**
       * max width of select's dropdown (by default `minWidth`)
       */
    popperMaxWidth: String,
    /**
       * max height of select's dropdown
       */
    popperMaxHeight: {
      type: String,
      default: '336px'
    },
    /**
       * enable input
       */
    readonly: {
      type: Boolean,
      default: true
    },
    /**
       * whether options are loaded from server
       */
    remote: Boolean,
    /**
       * displayed text while loading data from server
       */
    loadingText: String,
    /**
       * displayed text when no data matches the filtering query
       */
    noMatchText: String,
    /**
       * displayed text when there is no options
       */
    noDataText: String,
    /**
       * custom remote search method
       */
    remoteMethod: Function,
    /**
       * custom remote search scroll method used for infinite scrolling
       */
    remoteScrollMethod: Function,
    /**
       * custom filter method
       */
    filterMethod: Function,
    /**
       * whether multiple-select is activated
       */
    multiple: Boolean,
    /**
       * control dropdown visibility. If `true` dropdown appears
       */
      showDropdown: Boolean,
      /**
       * prevent execute handleTreeNodeSelect
      */
      preventHandleTreeNodeSelect: {
        type: Boolean,
        default: false
      },
      /**
      * maximum number of options user can select when `multiple` is `true`. No limit when set to 0
      */
      multipleLimit: {
        type: Number,
        default: 0
      },
      /**
       * maximum number of option labels to show when `multiple` is `true`
       */
    multipleShowItemsLimit: {
      type: Number,
      default: 3
    },
    /**
       * placeholder
       */
    placeholder: {
      type: String,
      default() {
        return t('el.select.placeholder');
      }
    },
    /**
       * placeholder icon
       */
    placeholderIcon: String,
    /**
       * placeholder icon color
       */
    placeholderIconColor: String,
    /**
       * Search input placeholder
       */
    searchPlaceholder: {
      type: String,
      default() {
        return t('el.combobox.searchPlaceholder');
      }
    },
    /**
       * enable 'select-all' functionality (`All` label by default if `true`)
       */
    selectAll: [Boolean, String],
    /**
       * custom text displayed when all elements are selected in 'select-all' mode
       */
    allItemsSelectedText: String,
    /**
       * label
       */
    label: String,
    /**
       * type
       */
    type: String,
    /**
       * select first matching option on enter key. Use with `filterable` or `remote`
       */
    defaultFirstOption: Boolean,
    /**
       * when `multiple` and `filter` is true, whether to reserve current keyword after selecting an option
       */
    reserveKeyword: Boolean,
    /**
       * unique identity key name for value, required when value is an object
       */
    valueKey: {
      type: String,
      default: 'value'
    },
    /**
       * whether Select options render only after click
       */
    flyweight: {
      type: Boolean,
      default: false
    },
    /**
       * whether to emit change and input event on options removal, only applicable when `remote` is false
       */
    changeOnOptionsRemoval: {
      type: Boolean,
      default: true
    },
    /**
       * Total count for the search results. Can be a Number which use default text , or a String which will directly render for the search results count(empty string for the case of 0 results)
       */
    remoteSearchResultsCount: {
      type: [Number, String],
      default: undefined
    },
    showSelectedIcon: {
      type: Boolean,
      default: false
    },
    /**
       * enable translucent styles for select
       */
    translucent: {
      type: Boolean,
      default: false
    },
    preventHideOnClick: Boolean
  },

  emits: ['update:modelValue', 'clear', 'click', 'focus', 'blur', 'visible-change', 'change'],

  data() {
    return {
      cachedOptions: [],
      cachedPlaceHolder: '',
      createdLabel: null,
      createdSelected: false,
      currentPlaceholder: '',
      filteredOptionsCount: 0,
      hoverIndex: -1,
      inputWidth: 0,
      isFirstTrigger: true,
      isWithinRemoteDecouncePeriod: false,
      keyboardNavigate: false,
      options: [],
      optionsCount: 0,
      previousQuery: '',
      previousScrollTop: '',
      previousSelected: [],
      query: '',
      searchUnchangedSinceOpen: true,
      selectAllValue: 'all',
      selectDropdownMounted: false,
      selected: this.multiple ? [] : {},
      selectedIcon: '',
      selectedIconColor: '',
      selectedLabel: '',
      selectedPlaceholderIcon: this.placeholderIcon,
      selectedPlaceholderIconColor: this.placeholderIconColor,
      tree: null,
      visible: false
    };
  },

  computed: {
    selectAllLabel() {
      return typeof this.selectAll === 'string' ? this.selectAll : t('el.select.all');
    },
    withTree() {
      return this.tree !== null;
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    iconClass() {
      const criteria = this.clearable
          && !this.disabled
          && this.selectionCount;
      return criteria ? 'i-times--16' : (this.visible ? 'i-chevron-up--16' : 'i-chevron-down--16');
    },

    emptyText() {
      let emptyText = null;

      if (!this.isLoadingShown) {
        if (this.remote && this.query === '' && this.options.length === 0) emptyText = this.t('el.select.noData');
        if (this.filterable && this.query && this.filteredOptionsCount === 0) {
          emptyText = this.noMatchText || this.t('el.select.noMatch');
        }
        if (this.options.length === 0 && !this.remote) {
          emptyText = this.noDataText || this.t('el.select.noData');
        }
      }

      return emptyText;
    },

    selectSize() {
      return this.size || this._elFormItemSize;
    },

    multipleText() {
      let selected = this.selected;
      if (!selected || !selected.length) return '';

      if (this.withTree && !this.tree.checkStrictly) {
        selected = selected.filter((item) => {
          if (item.node !== undefined) {
            return !item.node.childNodes || !item.node.childNodes.length;
          }
          return true;
        });
      }
      const countNumber = selected.length;
      const optionsSelected = this.remote ? selected : selected.sort((a, b) => a._uid - b._uid);
      const isAllSelected = this.options.length - 1 === this.modelValue.length;

      let text = countNumber <= this.multipleShowItemsLimit
        ? optionsSelected.map((x) => x.currentLabel).join(', ').trim()
        : `${countNumber} ${this.t('el.select.item')} ${this.t('el.select.selected')}`;
      const title = optionsSelected.map((x) => x.currentLabel).join(', ').trim();

      if (this.selectAll && isAllSelected && this.allItemsSelectedText) {
        text = this.allItemsSelectedText;
      }
      return { text, title };
    },

    computedLabel() {
      if (typeof this.customText === 'string') {
        return this.customText;
      }

      return this.multiple ? this.multipleText.text : this.selectedLabel;
    },

    computedTitle() {
      if (this.$refs.reference && this.$refs.reference.type === 'password') {
        return '';
      }
      if (typeof this.customHint === 'string') {
        return this.customHint;
      }
      if ((!this.multiple && !(this.selectedLabel && this.selectedLabel.length))
          || (this.multiple && !(this.multipleText && this.multipleText.title))) {
        return this.placeholder;
      }

      return this.multiple ? this.multipleText.title : this.selectedLabel;
    },

    computedRemoteSearchResultsCount() {
      return typeof this.remoteSearchResultsCount === 'number'
        ? `${this.remoteSearchResultsCount} ${this.t('el.select.item')} ${this.t('el.select.found')}`
        : this.remoteSearchResultsCount;
    },

    isOptionsSectionShown() {
      return (this.options.length > 0 || this.emptyText) && !this.isLoadingShown;
    },

    selectionCount() {
      if (this.multiple) {
        return this.selected.length;
      }

      // TODO check selected
      return this.selected ? 1 : 0;
    },

    isDividerShown() {
      if (typeof this.remoteSearchResultsCount === 'number' && this.previousSelected) {
        if (this.remoteSearchResultsCount - this.previousSelected.length > 0) {
          return true;
        }
      }
      return false;
    },

    isLoadingShown() {
      return this.loading || (this.remote && this.remoteMethod && this.isWithinRemoteDecouncePeriod);
    },

    isRemoteFilterableMultiple() {
      return this.remote && this.filterable && this.multiple;
    },

    isRemoteSelectedSectionShown() {
      return this.isRemoteFilterableMultiple
          && !this.isLoadingShown && this.previousSelected.length && !this.query.length;
    },

    isRemoteSearchResultsCountShown() {
      return this.remote
          && this.computedRemoteSearchResultsCount !== undefined
          && this.filterable
          && !this.isLoadingShown
          && this.query.length
          && this.options.length;
    }
  },

  watch: {
    disabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },

    placeholder(val) {
      // eslint-disable-next-line no-multi-assign
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },

    value(val) {
      if (this.isFirstTrigger) {
        this.updateValue(val);
        this.isFirstTrigger = false;
      } else {
        this.updateValueDeb(val);
      }
    },

    showDropdown() {
      this.visible = this.showDropdown;
    },

    visible(val) {
      if (!val) {
        eventBus.$emit('el.select.dropdown.destroyPopper');

        // this.broadcast('ElSelectDropdown', 'destroyPopper');
        this.query = '';
        this.selectedLabel = '';
        if (this.filterable) {
          this.handleQueryChange(this.query, false);
        }
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.createdSelected) {
              this.selectedLabel = this.createdLabel;
            } else {
              this.selectedLabel = this.selected.currentLabel;
            }
          }
          this.resetHoverIndex();
        } else {
          this.$nextTick(() => {
            this.hoverIndex = -1;
          });
        }
        this.hoverOption = -1;
        this.doDestroy();
        this.$nextTick(() => {
          this.keyboardNavigate = false;
        });
      } else {
        this.setScrollPosition();
        const updatePopper = () => {
          eventBus.$emit('el.select.dropdown.updatePopper');
          // this.broadcast('ElSelectDropdown', 'updatePopper');
          this.$nextTick(() => {
            eventBus.$emit('el.option.updatePopper');
            // this.broadcast('ElOption', 'updatePopper');
            const scrollbar = this.$refs.scrollbar;
            if (scrollbar) {
              scrollbar.update();
              scrollbar.updateScrollPosition();
            }
          });
        };
        if (this.flyweight) {
          this.$nextTick(updatePopper);
        } else {
          updatePopper();
        }
        if (this.filterable) {
          this.handleQueryChange(this.query, true);
          if (!this.multiple) {
            if (!this.remote) {
              eventBus.$emit('el.option.queryChange');
              eventBus.$emit('el.option.group.queryChange');

              // this.broadcast('ElOption', 'queryChange', '');
              // this.broadcast('ElOptionGroup', 'queryChange');
            }
          } else if (this.remote) {
            this.searchUnchangedSinceOpen = true;
            this.previousSelected = this.selected;
          }
        }
      }
      // console.log('toggleDropdown3', val);

      this.$emit('visible-change', val);
    },

    options(val) {
      if (this.$isServer) return;
      if (this.multiple) {
        this.resetInputHeight();
        // To set the value for this.modelValue when option changes -- multiple
        if (this.changeOnOptionsRemoval && !this.remote) {
          const newValue = val.filter((option) => this.modelValue?.some((element) => isEqual(element, option.value)))
            .map((option) => option.value);
          this.emitChange(newValue);
          this.$emit('update:modelValue', newValue);
        }
        // To set the value for this.modelValue when option changes -- single
      } else if (this.changeOnOptionsRemoval
          && !this.remote
          && !val.some((option) => isEqual(this.modelValue, option.value))) {
        this.$emit('update:modelValue', '');
        this.emitChange('');
        this.$emit('clear');
      }

      if (this.remote) {
        // reset scrollbar postion to top
        this.$nextTick(() => {
          this.$refs.scrollbar.updateScrollPosition();
        });
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption();
      }
      if (this.selectAll && this.options.length) {
        this.options[0].itemSelected = this.options.length - 1 === this.modelValue?.length;
      }
      this.setSelected();
    }
  },

  created() {
    // eslint-disable-next-line no-multi-assign
    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
    this.updateValueDeb = debounce(100, false, (val) => {
      this.updateValue(val);
    });
    if (this.multiple && !Array.isArray(this.modelValue)) {
      this.$emit('update:modelValue', []);
    }

      eventBus.$on('el.select.handleOptionClick', this.handleOptionClick);
      eventBus.$on('el.select.setSelected', this.setSelected);
      if (!this.preventHandleTreeNodeSelect) {
        eventBus.$on('el.select.handleTreeNodeSelect', this.handleTreeNodeSelect);
      }
      eventBus.$on('onHidePopper', this.handleClose);
    },

  mounted() {
    if (this.withTree) {
      const onTreeMovements = () => setTimeout(() => eventBus.$emit('el.select.dropdown.updatePopper'), 0);

      this.tree.$on('node-expand', onTreeMovements);
      this.tree.$on('node-collapse', onTreeMovements);
    }
    if (this.multiple && Array.isArray(this.modelValue) && this.modelValue.length > 0) {
      this.currentPlaceholder = '';
    }

    if (this.remote && this.multiple) {
      this.resetInputHeight();
    }
    if (this.remote && typeof this.remoteMethod === 'function') {
      this.debouncedRemoteMethod = debounce(500, false, (val) => {
        this.remoteMethod(val);
        this.isWithinRemoteDecouncePeriod = false;
      });
    }
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      }
      const dropdownPopper = this.$refs.popper;
      if (dropdownPopper && dropdownPopper.$refs.search && this.tree) {
        const searchEl = dropdownPopper.$refs.search.$el;
        searchEl.addEventListener('keydown', this.focusOnTree);
      }
    });
    this.setSelected();
    this.resetHoverIndex();
  },

  methods: {
    updateValue(val) {
      if (this.multiple) {
        this.resetInputHeight();
        if (val.length > 0) {
          this.currentPlaceholder = '';
        } else {
          this.currentPlaceholder = this.cachedPlaceHolder;
        }
        if (this.selectAll && this.options.length) {
          this.options[0].itemSelected = this.options.length - 1 === val.length;
        }
      }
      this.setSelected();
      this.emitDisplayValue();
      this.resetHoverIndex();
    },
    focusOnTree(event) {
      const key = event.key;
      if (key === 'Tab') {
        this.tree.$el.focus();
      } else if (key === 'ArrowDown' || key === 'Down') {
        this.navigateOptions('next');
        if (this.tree.$el.children[0] && this.tree.$el.children[0].children[0]) {
          this.tree.$el.children[0].children[0].focus();
        }
      } else if (key === 'ArrowUp' || key === 'Up') {
        this.navigateOptions('prev');
        const treeSize = this.tree.$el.children.length - 1;
        if (this.tree.$el.children[treeSize] && this.tree.$el.children[treeSize].children[0] && treeSize >= 0) {
          this.tree.$el.children[treeSize].children[0].focus();
        }
      } else if (key === 'Enter') {
        this.toggleDropdown();
      }
    },
    handleAllClick() {
      if (!this.options[0].itemSelected) {
        const newValue = this.options.slice(1).map((option) => option[this.valueKey]);

        this.emitChange(newValue);
        this.$emit('update:modelValue', newValue);
        this.options[0].itemSelected = true;
      } else {
        this.emitChange([]);
        this.$emit('update:modelValue', []);
        this.options[0].itemSelected = false;
      }
    },
    handleQueryChange(val, forceQuery = false) {
      if (this.previousQuery === val && !forceQuery) return;
      this.previousQuery = val;
      this.$nextTick(() => {
        if (this.visible) eventBus.$emit('el.select.dropdown.updatePopper');
      });
      this.hoverIndex = -1;
      if (this.multiple && this.filterable) {
        this.resetInputHeight();
      }
      if (this.remote && typeof this.remoteMethod === 'function') {
        this.hoverIndex = -1;
        this.isWithinRemoteDecouncePeriod = true;
        if (this.$refs.scrollbar) this.$refs.scrollbar.$refs.wrap.scrollTop = 0;
        this.debouncedRemoteMethod(val);
      } else if (typeof this.filterMethod === 'function') {
        this.filterMethod(val);
        eventBus.$emit('el.option.group.queryChange');

        // this.broadcast('ElOptionGroup', 'queryChange');
      } else if (this.withTree) {
        const filtered = this.tree.find(val);
        this.filteredOptionsCount = filtered.length;
      } else {
        this.filteredOptionsCount = this.optionsCount;

        eventBus.$emit('el.option.queryChange', val);
        eventBus.$emit('el.option.group.queryChange');
        // this.broadcast('ElOption', 'queryChange', val);
        // this.broadcast('ElOptionGroup', 'queryChange');
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption();
      }

      if (!this.remote) {
        this.options.forEach((option) => {
          option.keyword = val;
        });
      }
    },

    setScrollPosition() {
      if (!this.remote && this.$refs.popper !== undefined && this.previousScrollTop !== -1) {
        const dropdown = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
        this.$nextTick(() => {
          dropdown.scrollTop = this.previousScrollTop;
        });
      }
    },

      receiveScrollTop() {
        if (this.$refs.popper === undefined) {
          return;
        }
        const dropdown = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
        if (dropdown.scrollTop !== 0 && this.modelValue?.length === 0) {
          this.previousScrollTop = dropdown.scrollTop;
        }
        return dropdown.scrollTop;
      },
      scrollToOption(option) {
        const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el;
        if (this.$refs.popper && target) {
          const dropdown = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
          scrollIntoView(dropdown, target);
        }
        this.keyboardNavigate = true;
      },

    handleDropdownEnter() {
      this.$nextTick(() => this.scrollToOption(this.selected));
    },

    emitChange(val) {
      if (!valueEquals(this.modelValue, val)) {
        this.$emit('change', val);

        eventBus.$emit('el.form.change', val);
        eventBus.$emit('el.form.input', val);
        // this.dispatch('ElFormItem', 'el.form.change', val);
        // this.dispatch('ElFormItem', 'el.form.input', val);

        if (this.$refs.reference) {
          this.focus();
        }
      }
    },

    getOption(value) {
      let option;
      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        if (isEqual(cachedOption.value, value)) {
          option = cachedOption;
          break;
        }
      }
      if (option) return option;
      if (this.flyweight) {
        const defaultSlots = this.$slots.default?.();
        if (defaultSlots !== undefined) {
          const selectedOptionNode = defaultSlots
            .find((node) => node.componentOptions !== undefined
                && node.componentOptions.propsData[this.valueKey] === this.modelValue);
          if (selectedOptionNode !== undefined) {
            return {
              value: selectedOptionNode.componentOptions.propsData[this.valueKey],
              currentLabel: selectedOptionNode.componentOptions.propsData.label
            };
          }
        }
      }
      const label = !(isObjectLike(value) && !this.multiple) ? value : '';
      const newOption = {
        value,
        currentLabel: label
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },

    setSelected() {
      if (this.$refs.popper !== undefined) {
        const dropdown = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
        this.previousScrollTop = dropdown.scrollTop; // current location of the first node in virtual list
      }

      if (!this.multiple) {
        const option = this.getOption(this.modelValue);
        if (option.created) {
          this.createdLabel = option.currentLabel;
          this.createdSelected = true;
        } else {
          this.createdSelected = false;
        }
        this.selectedLabel = option.currentLabel;
        this.selected = option;
        if (this.showSelectedIcon && option.icon !== '') {
          this.selectedIconColor = option.iconColor;
          this.selectedIcon = option.icon;
        }
      } else {
        const result = [];
        if (Array.isArray(this.modelValue)) {
          this.modelValue.forEach((value) => {
            result.push(this.getOption(value));
          });
        }
        this.selected = result;
      }

        this.$nextTick(() => {
          this.resetInputHeight();
          if (this.tree && this.selected) {
            // set tree current node and selected nodes
            if (Array.isArray(this.selected) && this.tree.nodeKey && !this.tree.lazy && !this.tree.checkStrictly) {
              this.tree.setCheckedNodes([]);
              this.selected.forEach((treeNode) => {
                const treeNodeState = treeNode.node;
                if (treeNodeState?.isLeaf && !treeNodeState.checked) {
                  treeNodeState.setChecked(true);
                }
              });
            } else if (this.selected.node) {
              const treeNodeState = this.selected.node;
              treeNodeState && treeNodeState.store.setCurrentNode(treeNodeState);
            }
          }
        });
      },

    handleFocus(event) {
      this.$emit('focus', event);
      eventBus.$emit('el.form.focus', this.modelValue);
      // this.dispatch('ElFormItem', 'el.form.focus', this.modelValue);
    },

    handleBlur(event) {
      if (!this.visible) {
        this.$emit('blur', event);
        eventBus.$emit('el.form.blur', this.modelValue);
        // this.dispatch('ElFormItem', 'el.form.blur', this.modelValue);
        this.$nextTick(() => this.highlightLabel(this.query));
      }
    },
    handleTab() {
      if (this.withTree) {
        this.handleDropdownEnter();
      } else {
        this.visible = false;
      }
    },
    highlightLabel(value) {
      if (value !== '' && !this.remote) {
        this.options.forEach((option) => {
          option.keyword = value;
        });
      }
    },
    handleClick(event) {
      const sourceClassName = event.target.className;
      if (sourceClassName.indexOf('times') > 0 && this.clearable && this.selectionCount) {
        this.deleteSelected(event);
      } else {
        this.toggleDropdown();
      }
      this.$emit('click', event);
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    handlePreventHideOnClick() {
      if (this.showDropdown || !this.visible) {
        return;
      }

      this.visible = true;
      this.receiveScrollTop();
    },

    handleClose() {
      if (this.showDropdown || !this.visible) {
        return;
      }
      this.visible = false;

      this.receiveScrollTop();
    },

    handleInput(value) {
      this.$emit('update:modelValue', value);
      this.emitChange(value);
    },

    resetInputHeight() {
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        const inputChildNodes = this.$refs.reference.$el.childNodes;
        const input = [].filter.call(inputChildNodes, (item) => item.tagName === 'INPUT')[0];
        const tags = this.$refs.tags;
        if (input) {
          input.style.height = this.selected.length === 0
            ? `${sizeMap[this.selectSize] || defaultOptionHeight}px`
            : `${Math.max(tags ? (tags.clientHeight + 10) : 0, sizeMap[this.selectSize] || defaultOptionHeight)}px`;
        }
        if (this.visible && this.emptyText !== false) {
          eventBus.$emit('el.select.dropdown.updatePopper');

          // this.broadcast('ElSelectDropdown', 'updatePopper');
        }
      });
    },

    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected);
        } else {
          this.hoverIndex = -1;
        }
      }, 100);
    },

    handleTreeNodeSelect(treeNode) {
      if (this.multiple) {
        const value = this.modelValue.slice();
        const optionIndex = this.getValueIndex(value, treeNode.value);

        if (!treeNode.node.checked && optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (treeNode.node.checked && optionIndex < 0) {
          value.push(treeNode.value);
        }

        this.$emit('update:modelValue', value);
        this.emitChange(value);
      } else {
        this.$emit('update:modelValue', treeNode.value);
        this.emitChange(treeNode.value);
        this.visible = false;
      }
    },

    handleOptionClick(option) {
      this.handleOptionSelect(option);
      this.hoverIndex = -1;
    },

    handleOptionSelect(option) {
      if (this.selectAll && option === this.options[0]) return;
      if (this.multiple) {
        const value = this.modelValue.slice();
        const optionIndex = this.getValueIndex(value, option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
          value.push(option.value);
        }
        this.$emit('update:modelValue', value);
        this.emitChange(value);
        if (option.created) {
          this.query = '';
          this.handleQueryChange('');
        }
      } else {
        this.$emit('update:modelValue', option.value);
        this.emitChange(option.value);
        this.visible = false;
      }
      const { icon, iconColor } = option;
      if (this.showSelectedIcon && !!icon) {
        this.selectedIcon = icon;
        this.selectedIconColor = iconColor;
      }
      this.$nextTick(() => this.scrollToOption(option));
      this.$refs.reference.focus();
    },

    getValueIndex(arr = [], value) {
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
      if (!isObject) {
        return arr.indexOf(value);
      }
      return Object.values(arr).indexOf(value);
    },

    toggleDropdown() {
      this.receiveScrollTop();
      if (!this.disabled) {
        this.visible = !this.visible;
        if (this.visible) {
          this.$refs.reference.focus();
        }
      }
    },

    selectOption() {
      if (!this.visible) return;
      if (this.selectAll && !this.hoverIndex) {
        this.handleAllClick();
        return;
      }
      if (this.readonly && !this.visible) {
        this.$nextTick(() => this.toggleDropdown());
      } else if (this.options[this.hoverIndex]) {
        this.handleOptionSelect(this.options[this.hoverIndex]);
      } else if (this.filteredOptionsCount === 1) {
        const selectedItem = this.options.filter((item) => (
          item.currentLabel.toLowerCase().indexOf(this.query.toLowerCase()) > -1
        ));

        this.handleOptionSelect(selectedItem[0]);
      }
    },

    deleteSelected(event) {
      const initalValue = this.multiple ? [] : '';
      event.stopPropagation();
      this.$emit('update:modelValue', initalValue);
      this.emitChange(initalValue);
      this.$emit('clear');

      // remove keyboard navigation hover effects and return focus select input
      this.clearHover();
      this.$refs.popper.$refs.search && this.$refs.popper.$refs.search.focus();
    },

    onSearchEdit(newValue) {
      this.$emit('searchedit', newValue);
      this.query = newValue;
      this.handleQueryChange(this.query);
      if (!this.query.length) {
        this.previousSelected = this.selected;
      }
    },

    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        this.options.splice(index, 1);
      }
    },

    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },

    checkDefaultFirstOption() {
      this.hoverIndex = -1;
      for (let i = 0; i !== this.options.length; ++i) {
        const option = this.options[i];
        if (this.query) {
          // pick first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            this.hoverIndex = i;
            break;
          }
        } else {
          // pick currently selected option
          // eslint-disable-next-line no-lonely-if
          if (option.itemSelected) {
            this.hoverIndex = i;
            break;
          }
        }
      }
    },

    emitDisplayValue() {
      if (!this.$parent
          || !this.elFormItem.$options
          || this.$parent.$options.name !== this.elFormItem.$options.name) {
        return;
      }
      const displayValue = {};
      if (this.multiple) {
        displayValue[this.elFormItem.prop] = this.selected.reduce((accum, option) => {
          if (this.modelValue.indexOf(option.value) !== -1) {
            option.label ? accum.push(option.label) : accum.push(option.value);
          }
          return accum;
        }, []).join('; ');
      } else {
        displayValue[this.elFormItem.prop] = this.selected.label ? this.selected.label : this.selected.value;
      }

      eventBus.$emit('el.multisearch.displayValue', displayValue);
      // this.dispatch('ElMultiSearch', 'display-value', displayValue);
    },

    handleDropdownScroll() {
      if (this.remote && typeof this.remoteScrollMethod === 'function'
          && !this.isWithinRemoteDecouncePeriod && !this.scrollLoading && !this.isScrollEnd) {
        const scrollWrapEl = this.$refs.scrollbar.$refs.wrap;
        const { scrollTop, clientHeight, scrollHeight } = scrollWrapEl;
        // 15px margin for keyboard navigation (key board navigation wont reach the scroll end)
        if (scrollHeight - scrollTop - clientHeight <= 15 && !this.isScrollEnd) {
          this.remoteScrollMethod(this.query);
        }
      }
    }
  }
};
</script>
