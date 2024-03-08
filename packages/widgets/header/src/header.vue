<template>
  <header
    class="el-header"
    :class="{
      [`el-header--color-${color}`]: isColorModifier(color),
      'el-header--bordered': bordered
    }"
    :style="{
      height: height,
      minHeight: height
    }"
  >
    <div
      v-if="title || $slots.default"
      class="el-header__content"
      :style="{alignItems: alignment}"
    >
      <slot>
        <span
          v-if="title"
          class="mx-24 el-text el-text--display-medium el-text--ellipsis"
        >
          {{ title }}
        </span>
      </slot>
    </div>
    <div
      v-if="$slots.actions"
      class="el-header__actions"
    >
      <slot
        v-if="searchCollapse"
        name="actions"
      />
    </div>
    <div
      class="el-header__aside"
    >
      <slot
        name="aside"
      />
    </div>
  </header>
</template>

<script>
  import createColorMixin from '@/mixins/color';

  export default {
    name: 'ElHeader',

    mixins: [
      createColorMixin(['fixed-white', 'nav-primary'])
    ],

    componentName: 'ElHeader',

    provide() {
      return {
        searchCollapse: this.changeSearchCollapse
      };
    },

    props: {
      bordered: {
        type: Boolean,
        default: true
      },
      height: {
        type: String,
        default: '64px'
      },
      color: {
        types: String,
        default: 'fixed-white'
      },
      title: {
        type: String,
        default: ''
      },
      alignment: {
        type: String,
        default: 'center'
      }
    },

    data() {
      return {
        searchCollapse: true
      };
    },

    methods: {
      changeSearchCollapse: function (isCollapsed) {
        this.searchCollapse = isCollapsed;
      }
    }
  };
</script>
