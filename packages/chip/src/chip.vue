<template>
  <span class="el-chip">
    <span
      class="el-chip__container"
    >
      <el-icon
        v-if="icon"
        class="el-chip__icon"
        :name="icon"
        color="brand-primary"
      />
      <span
        class="el-chip__text"
        :class="`el-chip__text-${className}`"
        :title="title"
      >
        <slot />
      </span>
      <el-button
        v-if="showClose"
        class="el-chip__close-button"
        type="ghost"
        size="small"
        icon="i-times--16"
        @click="handleClick"
      />
    </span>
  </span>
</template>

<script>
import Emitter from '@/mixins/emitter';
import ElIcon from 'packages/icon';
import ElButton from 'packages/button';

  export default {
    name: 'ElChip',
    components: {
      ElIcon,
      ElButton
    },
    mixins: [Emitter],
    props: {
      icon: {
        type: String
      },
      showClose: {
        type: Boolean,
        default: true
      },
      showHoverHint: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      className() {
        return this.showClose ? 'close' : 'no-close';
      },
      title() {
        if (!this.showHoverHint) return null;
        const defaultSlots = this.$slots?.default();
        if (defaultSlots && defaultSlots[0]) {
          return defaultSlots[0]?.text;
        }
        return null;
      }
    },
    methods: {
      handleClick(event) {
        this.$emit('click', event);
      }
    }
  };
</script>
