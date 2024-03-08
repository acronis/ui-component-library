<template>
  <ul
    v-show="visible"
    class="el-select-group__wrap"
  >
    <li class="el-select-group__title">
      {{ label }}
    </li>
    <li>
      <ul class="el-select-group">
        <slot />
      </ul>
    </li>
  </ul>
</template>

<script>
import eventBus from '@/utils/eventBus';

export default {

  name: 'ElOptionGroup',

  componentName: 'ElOptionGroup',

  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: true
    };
  },

  watch: {
    disabled(val) {
      eventBus.$emit('el.option.handleGroupDisabled', val);

      // this.broadcast('ElOption', 'handleGroupDisabled', val);
    }
  },

  created() {
    eventBus.$on('el.option.group.queryChange', this.queryChange);
  },

  mounted() {
    if (this.disabled) {
      eventBus.$emit('el.option.handleGroupDisabled', this.disabled);

      // this.broadcast('ElOption', 'handleGroupDisabled', this.disabled);
    }
  },

  methods: {
    queryChange() {
      this.visible = this.$children
          && Array.isArray(this.$children)
          && this.$children.some((option) => option.visible === true);
    }
  }
};
</script>

