<template>
  <transition
    name="el-zoom-in-top"
    @after-leave="doDestroy"
  >
    <div
      v-show="showPopper"
      class="el-autocomplete-suggestion el-popper"
      :style="{ width: dropdownWidth }"
      role="region"
    >
      <el-divider v-if="!$parent.$props.popperClass" />
      <el-scrollbar
        tag="ul"
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list"
      >
        <slot />
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
import Popper from '@/utils/vue-popper';
import ElScrollbar from 'packages/scrollbar';
import ElDivider from 'packages/divider';


export default {
  name: 'ElAutocompleteSuggestions',
  components: {
    ElScrollbar,
    ElDivider
  },

  mixins: [Popper],

  props: {
    popperOptions: {
      type: Object,
      default() {
        return {
          flipBehavior: ['bottom'],
          gpuAcceleration: false,
          boundariesElement: 'scrollParent'
        };
      }
    },
    id: String,
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    };
  },

  watch: {
    visible(val) {
      this.dropdownWidth = `${this.$parent.$refs.autocomplete.offsetWidth}px`;
      this.showPopper = val;
    }
  },

  updated() {
    this.$nextTick(() => {
      this.updatePopper();
    });
  },

  mounted() {
    this.$parent.popperElm = this.$el;
    this.popperElm = this.$el;
    this.referenceElm = this.$parent.$refs.autocomplete;
    this.referenceList = this.$el.querySelector('.el-autocomplete-suggestion__list');
    this.referenceList.setAttribute('role', 'listbox');
    this.referenceList.setAttribute('id', this.id);
  }
};
</script>
