<template>
  <div
    class="el-toolbar"
    :class="{
      [`el-toolbar--color-${color}`]: isColorModifier(color),
      'el-toolbar--bordered': bordered
    }"
    :style="{
      height: height,
      minHeight: height
    }"
  >
    <div class="el-toolbar__content">
      <slot />
    </div>
    <div class="el-toolbar__aside">
      <slot name="aside" />
      <template v-if="isActive">
        <div
          v-if="message || $slots.message"
          :class="{ 'mr-24': hideCloseButton }"
        >
          <slot name="message">
            <span class="el-text el-text--body-24 el-text--ellipsis">{{ message }}</span>
          </slot>
        </div>
        <div
          v-if="!hideCloseButton"
          class="el-toolbar__close"
        >
          <el-button
            type="ghost"
            tabindex="0"
            @click="handleClick"
            @keydown.enter="handleClick"
          >
            <el-icon name="i-times--16" />
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import ElIcon from 'packages/icon';
  import createColorMixin from '@/mixins/color';

  export default {
    name: 'ElToolbar',

    mixins: [
      createColorMixin(['fixed-white'])
    ],

    componentName: 'ElToolbar',

    components: {
      ElIcon
    },

    props: {
      message: {
        type: String,
        default: ''
      },
      bordered: {
        type: Boolean,
        default: true
      },
      height: {
        type: String,
        default: '64px'
      },
      hideMessage: {
        type: Boolean,
        default: false
      },
      hideCloseButton: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      isActive() {
        return this.$parent.$options.name === 'ElToolbarContainer' && (this.$parent.active || this.$parent.value);
      }
    },

    methods: {
      handleClick() {
        this.$parent.$options.name === 'ElToolbarContainer' && this.$parent.$emit('input', false);
      }
    }
  };
</script>
