<template>
  <transition
    name="el-zoom-in-top"
    @after-leave="doDestroy"
  >
    <div
      v-show="showPopper"
      class="el-dropdown-menu el-popper qa-dropdown-menu"
      :class="{ 'el-dropdown-menu__no-border': dropdown.isSidebar }"
    >
      <el-scrollbar
        tag="ul"
        :wrap-style="`min-width: ${128 + scrollbarWidth}px; max-height: ${maxHeight + scrollbarWidth}px;`"
        :dropdown="true"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list qa-select-dropdown-list"
      >
        <el-search
          v-if="dropdown.search"
          ref="search"
          v-model="currentValue"
          type="embedded"
          @input="handleInput"
        />
        <el-divider
          v-if="dropdown.search"
          class="el-dropdown-menu__divider qa-dropdown-menu-divider"
        />
        <slot />
        <div
          v-show="noDataVisible"
          ref="noData"
          class="el-dropdown-menu__no-data qa-dropdown-munu-no-data"
        >
          {{ noDataMessage }}
        </div>
      </el-scrollbar>
    </div>
  </transition>
</template>

<script>
  import Popper from '@/utils/vue-popper';
  import ElScrollbar from 'packages/scrollbar';
  import ElSearch from 'packages/search';
  import ElDivider from 'packages/divider';
  import scrollbarWidth from '@/utils/scrollbar-width';
  import HidePopper from '@/mixins/hidePopper';
  import ru from 'convert-layout/ru';
  import { t } from '@/locale';
  import eventBus from '@/utils/eventBus';

  export default {
    name: 'ElDropdownMenu',

    componentName: 'ElDropdownMenu',

    components: {
      ElScrollbar,
      ElDivider,
      ElSearch
    },

    mixins: [HidePopper, Popper],

    inject: ['dropdown'],

    props: {
      visibleArrow: {
        type: Boolean,
        default: false
      },
      noDataMessage: {
        type: String,
        default() {
          return t('el.dropdown.noDataMessage');
        }
      },
      maxHeight: {
        type: Number,
        default: 336
      }
    },

    data: () => ({
      scrollbarWidth: 0,
      currentValue: '',
      noDataVisible: false,
      ulElement: null
    }),

    computed: {
      menuItems() {
        const menuItems = [];
        const addMenuItemChild = (vm) => {
          if (vm.$options.name === 'ElDropdownItem') {
            menuItems.push(vm);
          }
          if (vm.$children.length) {
            vm.$children.forEach((child) => addMenuItemChild(child));
          }
        };
        addMenuItemChild(this);
        return menuItems;
      }
    },

    watch: {
      'dropdown.placement': {
        immediate: true,
        handler(val) {
          this.currentPlacement = val;
        }
      },
      showPopper(val) {
        if (this.dropdown.search && val) {
          this.$nextTick(() => {
            this.$refs.search.focus();
          });
        }
      }
    },

    created() {
      eventBus.$on('updatePopper', () => {
        if (this.showPopper) this.updatePopper();
      });
      eventBus.$on('visible', (val) => {
        this.showPopper = val;
      });
      eventBus.$on('onHidePopper', () => this.$parent.$emit('onHidePopper'));
    },

    mounted() {
      this.scrollbarWidth = scrollbarWidth();
      this.ulElement = this.$el.querySelector('.el-select-dropdown__list');
      this.currentValue = this.dropdown.currentItem;

      // eslint-disable-next-line no-multi-assign
      this.dropdown.popperElm = this.popperElm = this.$el;
      if (this.dropdown.splitButton) {
        this.referenceElm = this.dropdown.$el.querySelector('.el-dropdown__split-right');
      } else {
        this.referenceElm = this.$parent.$el;
      }
      // to support v-slot syntax
      this.dropdown.initDomOperation();
      // Firefox don't detect click event on iframe.
      window.addEventListener('blur', this.windowOnBlur);
    },
    beforeUnmount() {
      window.removeEventListener('blur', this.windowOnBlur);
    },

    methods: {
      windowOnBlur() {
        if (this.popperJS) {
          this.dropdown.hide();
        }
      },
      handleInput(value) {
        this.computeMatchNumber(value);
        this.filter(value);
        this.checkMatches();
        this.menuItems.forEach((meanuItem) => {
          meanuItem.updateHighlightFormatText(value);
        });
        this.$nextTick(() => {
          this.ulElement.style.maxHeight = '';
        });
      },

      computeMatchNumber(value) {
        let count = 0;
        this.menuItems.forEach((child) => {
          if (child.text().toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            count++;
          }
        });
        if (!count) {
          this.noDataVisible = true;
        }
        return count;
      },

      filter(val) {
        const value = ru.toEn(val);
        const itemHeight = 40;
        const paddings = 25;
        this.menuItems.forEach((vm) => {
          const child = vm.$el;
          const result = vm.text().toLowerCase().indexOf(value.toLowerCase()) !== -1;
          if (!result) {
            child.style.display = 'none';
            child.parentNode.style.minHeight = this.computeMatchNumber(val) !== 0 ? `${(this.computeMatchNumber(val) + 1) * itemHeight + paddings}px` : '145px';
          } else {
            this.$refs.noData.style.display = 'none';
            child.parentNode.style.maxHeight = `${(this.computeMatchNumber(val) + 1) * itemHeight + paddings}px`;
            child.style.display = '';
          }
          this.updatePopper();
        });
      },

      checkMatches() {
        let isNoMatches = true;
        this.menuItems.forEach((vm) => {
          isNoMatches = isNoMatches && vm.$el.style.display === 'none';
        });
        this.noDataVisible = isNoMatches;
      }
    }
  };
</script>
