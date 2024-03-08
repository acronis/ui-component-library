<template>
  <div
    class="el-collapse"
    aria-multiselectable="true"
    role="tablist"
  >
    <slot />
  </div>
</template>

<script>
  import eventBus from '@/utils/eventBus';
  export default {
    name: 'ElCollapse',

    componentName: 'ElCollapse',

    props: {
      value: {
        type: [Array, String, Number],
        default: () => []
      },
      size: {
        type: String,
        default: 'small',
        validator: (value) => ['small', 'large', 'auto'].indexOf(value) > -1
      },
      accordion: Boolean,
      defaultExpanded: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        activeNames: [].concat(this.value)
      };
    },

    provide() {
      return {
        collapse: this
      };
    },

    watch: {
      value(value) {
        this.activeNames = [].concat(value);
      }
    },

    created() {
      eventBus.$on('item-click', this.handleItemClick);
    },

    mounted() {
      if (this.defaultExpanded && !this.accordion) {
        const activeNames = this.$slots.default()
          .filter((node) => node.componentOptions?.tag === 'el-collapse-item')
          .map((node) => node.componentOptions?.propsData?.name);
        this.setActiveNames(activeNames);
      }
    },

    methods: {
      setActiveNames(activeNames) {
        activeNames = [].concat(activeNames); // eslint-disable-line no-param-reassign
        const value = this.accordion ? activeNames[0] : activeNames;
        this.activeNames = activeNames;
        this.$emit('input', value);
        this.$emit('change', value);
      },
      handleItemClick(item) {
        if (this.accordion) {
          this.setActiveNames((this.activeNames[0] || this.activeNames[0] === 0)
            && this.activeNames[0] === item.name
            ? '' : item.name);
        } else {
          const activeNames = this.activeNames.slice(0);
          const index = activeNames.indexOf(item.name);

          if (index > -1) {
            activeNames.splice(index, 1);
          } else {
            activeNames.push(item.name);
          }
          this.setActiveNames(activeNames);
        }
      }
    }
  };
</script>
