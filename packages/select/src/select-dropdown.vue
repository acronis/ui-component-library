<template>
  <div
    v-show="visible"
    class="el-select-dropdown el-popper qa-select-dropdown"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass , {'dynamic-width': dynamicWidth}]"
    :style="{
      minWidth: minWidth,
      maxWidth: dynamicWidth ? windowWidth : maxWidth || minWidth
    }"
  >
    <div
      v-if="filterable"
      class="el-select-dropdown-search qa-select-dropdown-search"
    >
      <el-search
        ref="search"
        v-model="searchValue"
        class="el-select-dropdown-search-form qa-select-dropdown-search-form"
        :placeholder="searchPlaceholder"
        type="embedded"
        @keydown="scrollToReference"
        @update:model-value="onSearchEdit"
      />
      <el-divider />
    </div>
    <slot />
  </div>
</template>

<script>
import ElDivider from 'packages/divider';
import ElSearch from 'packages/search';
import HidePopper from '@/mixins/hidePopper';
import eventBus from '@/utils/eventBus';

let Popper;

export default {
  name: 'ElSelectDropdown',

  componentName: 'ElSelectDropdown',

  components: {
    ElSearch,
    ElDivider
  },

  mixins: [HidePopper, Popper],

  inject: ['select'],

  props: {
    maxWidth: {
      type: String,
      default: null
    },
    dynamicWidth: {
      type: Boolean,
      default: false
    },
    boundariesPadding: {
      default: 0
    },

    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },

    visibleArrow: {
      type: Boolean,
      default: false
    },

    filterable: {
      type: Boolean,
      default: false
    },

    visible: {
      type: Boolean,
      default: false
    },

    searchPlaceholder: {
      type: String,
      required: true
    }
  },

  emits: ['searchedit', 'update:modelValue'],

  data() {
    return {
      minWidth: '',
      searchValue: '',
      windowWidth: ''
    };
  },

  computed: {
    popperClass() {
      return this.$parent.popperClass;
    }
  },

  watch: {
    // TODO remove inputWidth dependency
    '$parent.inputWidth': function () {
      this.minWidth = `${this.$parent.$el.getBoundingClientRect().width}px`;
    },

    visible(val) {
      if (val && this.$refs.search && this.select.filterable) {
        this.$refs.search.focus();
      } else {
        this.searchValue = '';
      }
      this.showPopper = val;
      if (!val) this.doDestroy();
    }
  },

  beforeMount() {
    import('@/utils/vue-popper').then((module) => {
      Popper = module.default;
    });
  },

  mounted() {
    this.referenceElm = this.$parent.$refs.reference && this.$parent.$refs.reference.$refs.container;
    // eslint-disable-next-line no-multi-assign
    this.$parent.popperElm = this.popperElm = this.$el;
    eventBus.$on('el.select.dropdown.updatePopper', () => {
      if (this.$parent.visible) {
        this.minWidth = `${this.getParentWidth()}px`;
        this.updatePopper();
      }
    });
    this.minWidth = `${this.getParentWidth()}px`;
    this.windowWidth = `${window.innerWidth}px`;

    if (this.visible && this.$refs.search && this.select.filterable) {
      this.$refs.search.focus();
    }

    this.select.selectDropdownMounted = true;
    eventBus.$on('onHidePopper', () => this.$parent.$emit('onHidePopper'));
  },

  methods: {
    onSearchEdit(newValue) {
      this.$emit('searchedit', newValue);
    },
    scrollToReference() {
      const searchRect = this.referenceElm.getBoundingClientRect();
      if (searchRect.bottom > window.innerHeight) {
        this.referenceElm.scrollIntoView(false);
        this.$nextTick(() => this.updatePopper());
      } else if (searchRect.top < 0) {
        this.referenceElm.scrollIntoView();
        this.$nextTick(() => this.updatePopper());
      }
    },
    getParentWidth() {
      return this.$parent.$el.getBoundingClientRect().width;
    }
  }
};
</script>
