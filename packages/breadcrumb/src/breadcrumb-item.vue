<template>
  <a
    ref="link"
    class="el-breadcrumb__link"
    :class="{
      'is-active': isActive,
      'is-focus': isFocus
    }"
    @keydown.enter="handleEnterKeyDownTriggerClick"
    @keyup.enter="handleEnterKeyUp"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @focus="handleFocus"
    @blur="handleBlur"
    @click="onLinkClick"
  >
    <el-icon
      v-if="icon"
      :name="icon"
      class="el-breadcrumb__icon"
    />
    <span class="el-breadcrumb__inner">
      <slot />
    </span>
  </a>
</template>

<script>
  import TabFocusable from '@/mixins/tab-focusable';
  import ElIcon from 'packages/icon';

  export default {
    name: 'ElBreadcrumbItem',

    components: { ElIcon },

    mixins: [TabFocusable],

    props: {
      to: {},
      replace: Boolean,
      icon: String
    },

    methods: {
      onLinkClick() {
        if (this.to && this.$router) {
          this.replace ? this.$router.replace(this.to) : this.$router.push(this.to);
        }
        this.$emit('click');
      },

      handleEnterKeyDownTriggerClick() {
        this.handleEnterKeyDown();
        this.onLinkClick();
      }
    }
  };
</script>
